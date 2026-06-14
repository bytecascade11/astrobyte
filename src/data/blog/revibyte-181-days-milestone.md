---
title: "181 Days of ReviByte — AdSense Back, 400+ Daily Visitors, and What I Actually Built"
description: "How ReviByte reached 400+ daily organic visitors in 181 days — AdSense suspension lesson, building a download hub in Astro, anonymous Supabase comments, and what's next."
pubDatetime: 2026-06-14T20:15:00.000Z
author: iSamuel
slug: revibyte-181-days-milestone
featured: false
draft: false
tags:
  - revibyte
  - opinions
  - news
  - update
coverImage: /assets/posts/revibyte-181-days-milestone.jpg
coverImageAlt: ReviByte 181 days milestone — June 2026 showing 400+ daily visitors in Google Search Console
---

181 days since ReviByte launched on December 15, 2025. This post documents what was built, what broke, what was fixed, and — more importantly — how you can replicate the same setup on your own Astro blog.

---

## Table of Contents 

## TL;DR — What ReviByte Built in 181 Days

- **4 gaming hubs** live in Astro — COD Mobile, eFootball, PUBG Mobile, Mobile Legends Bang Bang
- **TikTok download hub** restructured at `/save/` with Instagram, YouTube, Facebook coming next
- **Supabase anonymous comments** replaced Giscus — no GitHub account needed to comment
- **400+ daily organic visitors** — 98% from Google Search, zero paid promotion
- **AdSense suspended for 30 days** then reinstated — caused by accidental self-visits to live site
- **Heliara AI** — a live on-site chat assistant built on Groq running on every page

If you want the detail on how any of those were built, keep reading.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
---

## What Changed Between Day 162 and Day 181

At [162 days](https://www.revibyte.blog/posts/heliara-ai-revibyte-save/), ReviByte had just shipped Heliara AI and the first TikTok downloader page. AdSense was suspended. The comment system was still Giscus.

By day 181 every one of those situations had changed. AdSense is reinstated. The downloader is now a proper hub. Comments are anonymous and frictionless. Traffic crossed 400 daily visitors and is trending upward.

Each of those changes has a replicable lesson underneath it.

---
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
## AdSense Invalid Traffic Suspension — The Exact Cause and How to Avoid It

This is the most practical section in this post. If you run AdSense, read it carefully.

On May 10, 2026, ReviByte's AdSense account was suspended for invalid activity. The suspension lasted 30 days — until June 9. The cause was not intentional. It was repeated self-visits to the live domain during layout testing, which created a pattern Google's detection system flagged: same device, same IP, frequent page loads, proximity to ad units.

Google does not distinguish between accidental and intentional invalid activity. The result is the same either way.

**Here is the exact behaviour to avoid and what to do instead:**

| Risky behaviour | Safe alternative |
|---|---|
| Checking live site layout on your main device | Use your Vercel preview URL — it's a different domain, ads don't load |
| Clicking around your own pages near ad units | Test on a separate device not linked to your Google account |
| Verifying ads are rendering by looking at the page | Check via browser devtools or page source — don't interact with the page normally |
| Visiting your live site multiple times a day | Limit to once or twice a week from your primary device |

The account was reinstated after a review request explaining the pattern clearly. Expect two to four weeks for a response. Be specific in the explanation — Google responds better to exact causes than vague apologies.

One structural change made to the download flow since reinstatement: ads on the downloader page are shown during content loading time, naturally visible to the user while the file information processes — no design pattern that could be read as coercive by a policy reviewer.

---
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
## How to Build a Download Hub in Astro — The Exact Structure

ReviByte Save started as a single page at `/save-tok/`. That approach works for one tool but breaks down the moment you want to add a second one — there's no parent, no hub, no shared identity.

The fix was restructuring it as a hub using the same pattern as ReviByte's gaming hubs. Here is the complete setup you can copy.

### URL and file structure

```
/save/              ← Hub index — all tools listed here
/save/tok/          ← TikTok downloader
/save/ig/           ← Instagram (coming soon)
/save/yt/           ← YouTube (coming soon)
```

Maps to these Astro files:

```
src/pages/save/index.astro
src/pages/save/tok/index.astro
```

In Astro, any folder containing `index.astro` becomes a clean URL with a trailing slash automatically. No routing configuration beyond your existing `astro.config.ts` is needed.

### The hub index page pattern

The `save/index.astro` file holds a `tools` array in the frontmatter:

```js
const tools = [
  { name: "TikTok Downloader", url: "/save/tok/", available: true },
  { name: "Instagram Downloader", url: "/save/ig/", available: false },
  { name: "YouTube Downloader", url: "/save/yt/", available: false },
];
```
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
The template loops over that array and renders a card for each tool. Available ones get a live link. Coming soon ones get a disabled badge. Adding a new downloader later is two steps: add it to the array and create the folder. The hub updates itself.

### Moving from `/save-tok/` to `/save/tok/`

The old URL had zero Google Search Console impressions so there was no SEO equity to protect. One entry in `vercel.json` handles any existing bookmarks or external links:

```json
{
  "source": "/save-tok/",
  "destination": "/save/tok/",
  "permanent": true
}
```

`"permanent": true` issues a 301 redirect — the correct signal for permanently moved content.

### The import path issue when nesting pages

When a page moves deeper in the folder structure, relative import paths break. The original file had:

```js
import Layout from "../layouts/Layout.astro";
```

After moving to `src/pages/save/tok/index.astro`, that becomes:

```js
import Layout from "../../../layouts/Layout.astro";
```

Three levels up instead of one. Miss this and the page builds with no layout — no header, footer, or styles, just raw unstyled HTML.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
---

## How to Replace Giscus with Anonymous Supabase Comments

Giscus requires a GitHub account. For a developer blog, that's acceptable. For a gaming and smartphone blog where most readers are on Android and have never opened GitHub in their lives, it stops most people from commenting at all.

ReviByte replaced Giscus with a custom anonymous comment system on Supabase. No account, no OAuth, no redirect. A reader types their name, types a comment, hits post. That's the entire flow.

**How the system works end to end:**

```
User fills form → POST to Supabase → comment saved to post_comments table
                                    ↓
                             page re-fetches comments
                                    ↓
                          new comment appears in list
```

### The Supabase table — copy this exactly

Create a table called `post_comments`:

| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, auto-generated |
| post_slug | text | Which post this comment belongs to |
| author_name | text | Display name from the form |
| content | text | The comment body |
| created_at | timestamp | Auto-set on insert |

Set Row Level Security to allow `SELECT` and `INSERT` for the anon role, block `UPDATE` and `DELETE`. Your public anon key is safe to use client-side with RLS in place. Never expose the service role key.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
### The core component logic

```js
// Load comments for the current post on page load
const { data: comments } = await supabase
  .from('post_comments')
  .select('*')
  .eq('post_slug', slug)
  .order('created_at', { ascending: true });

// Submit a new comment
async function submitComment(name, content, slug) {
  const { error } = await supabase
    .from('post_comments')
    .insert({ post_slug: slug, author_name: name, content });
  return error;
}
```

The component is a single `Comments.astro` file — drop it into any post layout and pass the post slug as a prop. It handles both fetching and submitting with no external dependencies beyond the Supabase JS client.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
### Moderation

With no account requirement, comments post immediately. The practical approach for a low-volume blog is periodic manual review from the Supabase dashboard. If volume grows, add an `approved` boolean column, default it to `false`, and filter your select to `eq('approved', true)`. Only approved comments render. New ones queue silently until reviewed.

---

## The Four Gaming Hubs — Current State

| Hub | URL | Status |
|---|---|---|
| COD Mobile | /codm/ | Live ✅ |
| eFootball | /efootball/ | Live ✅ |
| PUBG Mobile | /pubgmobile/ | Live ✅ |
| Mobile Legends Bang Bang | /mlbb/ | Live ✅ |

A Free Fire hub was built before MLBB and abandoned — Google consistently refused to index it despite multiple manual GSC requests. MLBB replaced it and indexed within minutes. The difference was content depth and internal linking structure at launch. MLBB went live with well-structured posts that Google could crawl and contextualise immediately. Free Fire launched thin and never recovered.

Each hub shares the same component architecture: index page, dynamic `[slug].astro` post pages, breadcrumbs, share bar, view counter, affiliate carousel, and Supabase comments.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
---

## Traffic at Day 181

| Metric | Current |
|---|---|
| Daily visitors | 400+ |
| Traffic source | 98% Google Search |
| Top countries | Nigeria, United States, Indonesia |
| Best performing hubs | eFootball, COD Mobile |
| Mobile share | ~80% |
| End of 2026 target | 2,000+ daily |

Zero paid traffic. Zero social campaigns. The WhatsApp channel and embedded share buttons handle passive distribution — that is the entire social strategy. Every visitor arrived because a ReviByte post ranked for a query they searched.

eFootball and COD Mobile lead because mobile gaming guides answer specific, recurring queries — controller settings, player ratings, loadout builds. Those queries are searched every week. A post that ranks earns visits continuously without needing frequent updates.

---
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
## FAQ

**How do I fix an AdSense invalid traffic suspension?**

Stop the behaviour that triggered it first. Then submit a review request through your AdSense account with a specific explanation of what caused the pattern. Vague appeals rarely work. Expect two to four weeks for a response. If the first review is denied, you can submit again with more detail.

**How do I build a TikTok downloader in Astro?**

You need an API route with `export const prerender = false` at the top — without this line, Vercel builds it as a static file and every POST request returns 404. Connect it to a RapidAPI TikTok data endpoint server-side. Never put your RapidAPI key in client-side JavaScript. The frontend posts the URL to your own API route, which calls RapidAPI and returns the video data.

**Why does my Astro API route return 404 on Vercel?**

Missing `export const prerender = false`. Astro 5 static builds exclude API routes unless you explicitly opt them out of prerendering. One line at the top of the file fixes it.

**How do I replace Giscus with something that doesn't require GitHub login?**

Supabase anonymous comments. Create the `post_comments` table as described above, set RLS to allow anon insert and select, build a `Comments.astro` component that fetches on load and submits on form post. No login, no OAuth, no third-party account needed to comment.

**How do I build a hub page in Astro for multiple tools?**

Create `src/pages/[hub]/index.astro` as the hub landing page. Each tool gets its own subfolder: `src/pages/[hub]/[tool]/index.astro`. The hub index page holds a tools array and loops over it to render cards. Adding a new tool means adding one entry to the array and creating one new folder.
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
---

## Summary — What You Can Take From This

| What was built | What you can copy |
|---|---|
| ReviByte Save hub at `/save/` | Folder-based hub structure in Astro |
| Anonymous Supabase comments | `post_comments` table + `Comments.astro` component |
| AdSense suspension recovery | Self-visit hygiene rules + review request process |
| 400+ daily organic visitors | Gaming hub content strategy targeting recurring search queries |
| 4 active gaming hubs | Shared hub component architecture in Astro |

181 days. Everything above was built from a phone, through GitHub's browser interface, with no laptop and no team. The point of documenting it isn't the achievement — it's that every single piece of it is reproducible.

— *iSamuel, Founder, ReviByte*
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4896561037705299"
     crossorigin="anonymous"></script>
<ins class="adsbygoogle"
     style="display:block; text-align:center;"
     data-ad-layout="in-article"
     data-ad-format="fluid"
     data-ad-client="ca-pub-4896561037705299"
     data-ad-slot="7554701431"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
