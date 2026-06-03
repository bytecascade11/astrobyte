-- Run this in your Supabase SQL Editor

-- Table to store one record per visitor per day
CREATE TABLE IF NOT EXISTS daily_visitors (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visitor_hash text NOT NULL,         -- hashed IP so no PII stored
  created_at timestamptz DEFAULT now()
);

-- Unique constraint: one record per visitor per day
CREATE UNIQUE INDEX IF NOT EXISTS daily_visitors_unique
  ON daily_visitors (visit_date, visitor_hash);

-- Table to store the daily totals (easier to query for dashboard)
CREATE TABLE IF NOT EXISTS daily_visitor_totals (
  visit_date date PRIMARY KEY,
  total_visitors integer NOT NULL DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_visitor_totals ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking) and reads (for dashboard)
CREATE POLICY "Allow insert" ON daily_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read totals" ON daily_visitor_totals FOR ALL USING (true);
CREATE POLICY "Allow upsert totals" ON daily_visitor_totals FOR INSERT WITH CHECK (true);

-- Function to upsert totals after each visit insert
CREATE OR REPLACE FUNCTION update_daily_totals()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO daily_visitor_totals (visit_date, total_visitors, updated_at)
  VALUES (NEW.visit_date, 1, now())
  ON CONFLICT (visit_date)
  DO UPDATE SET
    total_visitors = (
      SELECT COUNT(DISTINCT visitor_hash)
      FROM daily_visitors
      WHERE visit_date = NEW.visit_date
    ),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger
DROP TRIGGER IF EXISTS on_visit_insert ON daily_visitors;
CREATE TRIGGER on_visit_insert
  AFTER INSERT ON daily_visitors
  FOR EACH ROW EXECUTE FUNCTION update_daily_totals();
