---
title: "37 Days to Go: What 328 Days of Building ReviByte Taught Me"
description: "ReviByte is 37 days from its first birthday. Here is what 328 days on Astro, built entirely from a phone, taught me about indexing, speed, and what to keep."
pubDatetime: 2026-11-08T07:39:00Z
author: iSamuel
coverImage: "/assets/posts/revibyte-328-days-milestone-cover.jpg"
CoverimageAlt: "ReviByte 328 days milestone graphic with a 37-day countdown to the one-year mark"
tags:
  - milestone
  - astro
  - opinions
---

## Table of Contents 

## Overview 

Today is Day 328. ReviByte turns one on December 15, which leaves 37 days, and I'm writing this early on purpose. Anniversary posts have a way of turning into victory laps, and I'd rather put down what I actually know while there's still unfinished business on the table.

For anyone landing here for the first time: ReviByte is a tech and mobile gaming blog I run alone. It's built on Astro, and I build and maintain all of it from my phone, using GitHub's web editor, in between the lectures and labs of my final year in Physics and Electronics. No laptop, no local dev setup. That detail matters later in this post.

## The 328 days in one table

| Day | Date | What happened |
|---|---|---|
| 1 | Dec 15, 2025 | [The first post](https://www.revibyte.blog/posts/first-post-revibyte-live/) goes live. Three sentences and no traffic |
| 82 | Mar 6, 2026 | ReviByte lands on the Microsoft Store as a PWA |
| 121 | Apr 15, 2026 | 57 posts published, and the [121-day recap](https://www.revibyte.blog/posts/revibyte-121-days-later/) |
| 181 | Jun 14, 2026 | AdSense returns, 400+ daily visitors |
| 242 | Aug 14, 2026 | I [retire the downloaders and build ReviByte Tools](https://www.revibyte.blog/posts/revibyte-242-days-milestone/) |
| 273 | Sep 14, 2026 | [16 content hubs](https://www.revibyte.blog/posts/273-days-revibyte-16-hubs/) |
| 328 | Nov 8, 2026 | You're reading it |

<div id="waldo-tag-55826"></div>

## Why indexing on Astro feels so fast

Based on my recent publishing checks, new ReviByte posts have generally appeared in Google's index within about 90 minutes. I don't request indexing manually. I publish, close the editor, and more often than not it's there before my tea has gone cold. That's my observation, not a promise Google makes.

It would be easy to credit Astro for that and stop there. Astro helps because it generates lightweight HTML, so the article content is already in the first response instead of depending on JavaScript to build it in the browser. Google renders pages anyway, but that setup is easier on crawlers and on performance. It's one reason the pages I tested [scored 100 on mobile PageSpeed](https://www.revibyte.blog/posts/how-i-got-100-pagespeed-score-astro/).

But the framework wasn't the fast part. For months it was the slow part, because I was getting in its way. A trailing slash mismatch in `getPath.ts` meant every internal link was quietly redirecting, and Google kept seeing one URL while my site declared another. Fixing that was dull work with no visible reward. The [custom image sitemap](https://www.revibyte.blog/posts/how-i-fixed-google-image-sitemap--astro/) came after, and image discovery improved right away. Post indexing got noticeably quicker around the same time, though I can't separate the sitemap's effect from the other fixes. One cover image even appeared as a large visual result above a featured snippet, which I did not expect from a blog this young.

Astro gives you a clean starting line. It doesn't do the plumbing for you, and the same framework has given me very different results depending on what I'd wired up:

| Site or section | Setup | Result |
|---|---|---|
| ReviByte posts | Trailing slash fixed, image sitemap live | Around 90 minutes, no manual request |
| iSamuelDev (new domain) | Same theme, image sitemap, no history | Within about a week |
| Free Fire hub | Built like the other gaming hubs | Its pages kept failing to get indexed, so I dropped it for MLBB, which was picked up immediately. I later rebuilt Free Fire from scratch and it is indexed now |
| itel hub | Fully built, but missing from the image sitemap | A post stayed unindexed while the same content indexed under /posts/. I added the hub to the sitemap and suspect that gap was the cause, though I can't prove it |

The last two rows are the useful ones. I spent days suspecting Google when the likely cause was a missing entry in a sitemap file, and Free Fire only got indexed after I tore it down and built it again. I'd rather admit I don't know exactly which flaw the first version had than invent a tidy explanation.

<div id="waldo-tag-55826"></div>

## iSamuelDev has a new address

The Astro theme I built, iSamuelDev, now lives at **isamueldev.blog**. I bought the domain this month, set it up on Vercel, and the old `isamueldev.vercel.app` address now redirects to it with a permanent 301, so existing links and bookmarks still work.

I picked `.blog` over the usual options because it tells a visitor immediately that a person writes here. The theme went into Astro's theme directory after I built the whole thing in a browser tab, and the site around it is my personal dev blog. Until now it only covered web development. With a proper domain I'm adding a second pillar of broader developer topics, the kind people actually search for.

Don't expect that site to behave like ReviByte yet. In my experience so far it indexes in about a week rather than an hour. I'm not claiming that's a rule for new domains, only what I'm seeing, and my guess is Google is still deciding how much to trust it. I'd rather wait it out than force it.

## What I'd tell myself on Day 1

**Own your foundations.** The TikTok and Instagram downloaders worked, but they ran on someone else's API and someone else's rules. Nothing had gone wrong. I just didn't like how much of the site rested on things I couldn't control, so I replaced them with browser-only tools. I'd make that call earlier now.

**A dip is information, not a verdict.** Through October my search clicks slid for several weeks, old posts and new ones alike. My instinct was to start rewriting content. Instead I looked at site-wide causes first, because a drop that hits everything rarely has a post-level explanation. I'm still watching it.

**Every ad change costs something.** I've reshuffled my ad stack more than once, and Newor Media joined in October. Each shuffle had a price in layout shift, which hurts the reading experience and Core Web Vitals. Reserving space for ad slots did more for me than any new network.

**The slow bug is usually the real one.** Not one of my worst problems was glamorous. They were redirects, a sitemap, a missing collection entry.

## The next 37 days

The plan is modest. Keep publishing, aiming for 4 to 7 posts a week at a pace I can actually sustain. Finish the remaining device hubs without letting any of them skip the sitemap. Put real posts on isamueldev.blog. And keep going on the eFootball Team Builder, an Android app I'm building with Astro and Capacitor, compiled to an APK through GitHub Actions, still entirely from my phone.

If you've been reading since December, thank you. If you found this blog last week, you're not late. The best part of the year is still ahead.

<div id="waldo-tag-55823"></div>

## FAQ

### How long does a new ReviByte post take to get indexed?

Based on my recent checks, generally about 90 minutes, without a manual indexing request. That's an observation, not a guarantee, and it wasn't always this quick. Before I fixed the canonical URL mismatch and added the image sitemap, indexing was slow and unreliable.

### Is Astro better than WordPress for SEO?

Astro can be faster by default because it sends lightweight HTML, which helps Core Web Vitals. WordPress can be optimised for speed too. Either way, speed alone won't index a site. Sitemaps, consistent canonical URLs and internal links still decide the outcome, and Astro leaves all of that to you.

### Can you really run a blog from a phone?

Yes, though it takes patience. I edit code in GitHub's web editor, and Cloudflare and Vercel build and deploy on every commit. It's slower than a laptop and less forgiving of typos, but it works.

### What happened to isamueldev.vercel.app?

It redirects to isamueldev.blog with a 301 redirect. Old links still work, and search engines treat the new domain as the permanent home.

### Why did a hub fail to index when the same content indexed fine under /posts/?

In my case the hub's images were missing from the image sitemap, and adding them is the fix I applied. If a page itself isn't getting indexed, check its canonical URL, internal links, regular sitemap coverage and Search Console status before assuming the image sitemap is responsible.

### When is the one-year post?

December 15, 2026, exactly 365 days after the first post went live.

