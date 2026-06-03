
# Write all files with clean encoding (no BOM, UTF-8)

import os
os.makedirs('/mnt/agents/output', exist_ok=True)

# 1. API Route
api_track_visit = b'''import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

async function trackVisit(request: Request) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase env vars");
  }

  const supabase = createClient(url, key);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const ua = request.headers.get("user-agent") || "unknown";

  const raw = `${ip}:${ua}`;
  const visitorHash = raw.length > 255 ? raw.slice(0, 255) : raw;

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("daily_visitors")
    .upsert(
      {
        visit_date: today,
        visitor_hash: visitorHash,
      },
      {
        onConflict: "visit_date,visitor_hash",
      }
    );

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }

  return { ok: true, ip, date: today };
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const result = await trackVisit(request);
    return new Response(
      JSON.stringify({ ok: true, ...result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("[track-visit] GET error:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const result = await trackVisit(request);
    return new Response(
      JSON.stringify({ ok: true, ...result }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
    console.error("[track-visit] POST error:", err.message);
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
'''

# 2. TrackVisit Component
track_visit = b'''---
// src/components/TrackVisit.astro
// Add this to your layout or pages to track visits
---

<script is:inline>
  (function() {
    if (window.__revibyteTracked) return;
    window.__revibyteTracked = true;

    const track = function() {
      const url = "/api/track-visit/";
      const data = new Blob([], { type: "application/json" });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, data);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          keepalive: true,
        }).catch(function() {});
      }
    };

    track();
  })();
</script>
'''

# 3. Dashboard
dashboard = b'''---
// src/pages/dashboard.astro
// Your private daily visitor dashboard.
// Protect this page -- add a password check or keep the URL secret.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY
);

const today = new Date().toISOString().slice(0, 10);
const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

const { data: rows, error: queryError } = await supabase
  .from("daily_visitors")
  .select("visit_date, visitor_hash")
  .gte("visit_date", thirtyDaysAgo)
  .order("visit_date", { ascending: true });

if (queryError) {
  console.error("Dashboard query error:", queryError);
}

const totalsMap = new Map<string, number>();
for (const row of (rows ?? [])) {
  const date = row.visit_date;
  totalsMap.set(date, (totalsMap.get(date) || 0) + 1);
}

const totals: { visit_date: string; total_visitors: number }[] = [];
for (let i = 0; i < 30; i++) {
  const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
  totals.push({
    visit_date: d,
    total_visitors: totalsMap.get(d) || 0,
  });
}

const todayCount = totals.find((r) => r.visit_date === today)?.total_visitors ?? 0;
const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const yesterdayCount = totals.find((r) => r.visit_date === yesterday)?.total_visitors ?? 0;
const totalLast30 = totals.reduce((s, r) => s + r.total_visitors, 0);
const avgDaily = totals.length ? Math.round(totalLast30 / totals.length) : 0;
const peak = totals.reduce((m, r) => (r.total_visitors > m.count ? { date: r.visit_date, count: r.total_visitors } : m), { date: "-", count: 0 });
const trend = yesterdayCount > 0 ? (((todayCount - yesterdayCount) / yesterdayCount) * 100).toFixed(1) : null;

const chartLabels = JSON.stringify(totals.map((r) => r.visit_date.slice(5)));
const chartValues = JSON.stringify(totals.map((r) => r.total_visitors));
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ReviByte &middot; Visitor Dashboard</title>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --surface: #13131a;
      --border: #1e1e2e;
      --accent: #e8ff47;
      --accent2: #47c4ff;
      --text: #f0f0f5;
      --muted: #6b6b80;
      --up: #47ffb2;
      --down: #ff5c5c;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Syne', sans-serif;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }

    .wrap {
      max-width: 860px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    header {
      display: flex;
      align-items: baseline;
      gap: 1rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 1.5rem;
    }

    .logo {
      font-size: 1.1rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--accent);
    }

    .logo span { color: var(--text); }

    header h1 {
      font-size: 0.75rem;
      font-family: 'DM Mono', monospace;
      color: var(--muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-left: auto;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 600px) {
      .stats { grid-template-columns: repeat(4, 1fr); }
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem 1rem;
      position: relative;
      overflow: hidden;
      animation: fadeUp 0.5s ease both;
    }

    .card:nth-child(1) { animation-delay: 0.05s; }
    .card:nth-child(2) { animation-delay: 0.1s; }
    .card:nth-child(3) { animation-delay: 0.15s; }
    .card:nth-child(4) { animation-delay: 0.2s; }

    .card::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--accent);
      opacity: 0.6;
    }

    .card.today::after { background: var(--accent); }
    .card.avg::after   { background: var(--accent2); }
    .card.peak::after  { background: #ff9f47; }
    .card.total::after { background: var(--up); }

    .card-label {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 0.6rem;
    }

    .card-value {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .card.today .card-value { color: var(--accent); }
    .card.avg .card-value   { color: var(--accent2); }
    .card.peak .card-value  { color: #ff9f47; }
    .card.total .card-value { color: var(--up); }

    .card-sub {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      color: var(--muted);
      margin-top: 0.4rem;
    }

    .trend-up   { color: var(--up); }
    .trend-down { color: var(--down); }

    .chart-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      animation: fadeUp 0.5s 0.25s ease both;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }

    .chart-title {
      font-size: 0.75rem;
      font-family: 'DM Mono', monospace;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--muted);
    }

    .chart-badge {
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      background: #1e1e2e;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    canvas { width: 100% !important; }

    .empty {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--muted);
      font-family: 'DM Mono', monospace;
      font-size: 0.8rem;
    }

    .error-box {
      background: rgba(255, 92, 92, 0.1);
      border: 1px solid rgba(255, 92, 92, 0.3);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      color: #ff5c5c;
      font-family: 'DM Mono', monospace;
      font-size: 0.75rem;
    }

    footer {
      margin-top: 2rem;
      text-align: center;
      font-family: 'DM Mono', monospace;
      font-size: 0.65rem;
      color: var(--muted);
      letter-spacing: 0.05em;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div class="logo">Revi<span>Byte</span></div>
      <h1>Visitor Dashboard</h1>
    </header>

    {queryError && (
      <div class="error-box">
        Database error: {queryError.message}. Check your Supabase connection and table setup.
      </div>
    )}

    <div class="stats">
      <div class="card today">
        <div class="card-label">Today</div>
        <div class="card-value">{todayCount}</div>
        <div class="card-sub">
          {trend !== null
            ? Number(trend) >= 0
              ? <span class="trend-up">&#9650; {trend}% vs yesterday</span>
              : <span class="trend-down">&#9660; {Math.abs(Number(trend))}% vs yesterday</span>
            : "no data yet"}
        </div>
      </div>

      <div class="card avg">
        <div class="card-label">Daily Avg</div>
        <div class="card-value">{avgDaily}</div>
        <div class="card-sub">last {totals.length} days</div>
      </div>

      <div class="card peak">
        <div class="card-label">Peak Day</div>
        <div class="card-value">{peak.count}</div>
        <div class="card-sub">{peak.date !== "-" ? peak.date.slice(5) : "&mdash;"}</div>
      </div>

      <div class="card total">
        <div class="card-label">30-Day Total</div>
        <div class="card-value">{totalLast30}</div>
        <div class="card-sub">unique visitors</div>
      </div>
    </div>

    <div class="chart-box">
      <div class="chart-header">
        <span class="chart-title">Daily Unique Visitors</span>
        <span class="chart-badge">Last 30 days</span>
      </div>

      {totals.length === 0 || totalLast30 === 0
        ? <div class="empty">No data yet. Add the tracking snippet to your layout and wait for visits.</div>
        : <canvas id="visitChart"></canvas>
      }
    </div>

    <footer>revibyte.blog &middot; {today} &middot; data from supabase</footer>
  </div>

  {totals.length > 0 && totalLast30 > 0 && (
    <script define:vars={{ chartLabels, chartValues }}>
      const labels = JSON.parse(chartLabels);
      const values = JSON.parse(chartValues);

      const ctx = document.getElementById("visitChart").getContext("2d");

      const grad = ctx.createLinearGradient(0, 0, 0, 260);
      grad.addColorStop(0, "rgba(232,255,71,0.18)");
      grad.addColorStop(1, "rgba(232,255,71,0)");

      new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Visitors",
            data: values,
            borderColor: "#e8ff47",
            borderWidth: 2,
            backgroundColor: grad,
            pointBackgroundColor: "#e8ff47",
            pointRadius: 3,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.35,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#13131a",
              borderColor: "#1e1e2e",
              borderWidth: 1,
              titleColor: "#6b6b80",
              bodyColor: "#e8ff47",
              titleFont: { family: "DM Mono", size: 11 },
              bodyFont: { family: "DM Mono", size: 13, weight: "500" },
              callbacks: {
                title: (items) => items[0].label,
                label: (item) => ` ${item.raw} visitors`,
              }
            }
          },
          scales: {
            x: {
              grid: { color: "#1e1e2e" },
              ticks: { color: "#6b6b80", font: { family: "DM Mono", size: 10 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: "#1e1e2e" },
              ticks: {
                color: "#6b6b80",
                font: { family: "DM Mono", size: 10 },
                precision: 0
              }
            }
          }
        }
      });
    </script>
  )}
</body>
</html>
'''

# 4. SQL Setup
sql_setup = b'''-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS daily_visitors (
  id BIGSERIAL PRIMARY KEY,
  visit_date DATE NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (visit_date, visitor_hash)
);

CREATE INDEX IF NOT EXISTS idx_daily_visitors_date
ON daily_visitors(visit_date);

ALTER TABLE daily_visitors DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS daily_visitor_totals (
  visit_date DATE PRIMARY KEY,
  total_visitors INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_daily_totals()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_visitor_totals (visit_date, total_visitors)
  SELECT visit_date, COUNT(DISTINCT visitor_hash)
  FROM daily_visitors
  WHERE visit_date = COALESCE(NEW.visit_date, OLD.visit_date)
  GROUP BY visit_date
  ON CONFLICT (visit_date)
  DO UPDATE SET
    total_visitors = EXCLUDED.total_visitors,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS daily_visitors_change ON daily_visitors;

CREATE TRIGGER daily_visitors_change
AFTER INSERT OR UPDATE OR DELETE ON daily_visitors
FOR EACH ROW
EXECUTE FUNCTION update_daily_totals();

ALTER TABLE daily_visitor_totals DISABLE ROW LEVEL SECURITY;
'''

# Write all files as raw bytes (no BOM)
files = {
    'api_track_visit.ts': api_track_visit,
    'TrackVisit.astro': track_visit,
    'dashboard.astro': dashboard,
    'supabase_setup.sql': sql_setup,
}

for name, content in files.items():
    with open(f'/mnt/agents/output/{name}', 'wb') as f:
        f.write(content)

# Verify all files
for name in files.keys():
    with open(f'/mnt/agents/output/{name}', 'rb') as f:
        data = f.read(10)
        print(f"{name}: starts with '{data[:8].decode('utf-8', errors='replace')}', BOM={data.startswith(b'\\xef\\xbb\\xbf')}")

print("\nAll files written.")
