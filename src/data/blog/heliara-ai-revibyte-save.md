---  
title: "162 Days In — I Built an AI Assistant and a TikTok Downloader Into ReviByte"  
description: "At 162 days, ReviByte now has two free tools built in — Heliara AI, a real-time AI assistant, and ReviByte Save, a clean TikTok video downloader. Here's how I built both from scratch on a phone."  
pubDatetime: 2026-05-26T21:17:00Z  
author: iSamuel  
tags:  
  - revibyte  
  - heliara-ai  
  - revibyte-save  
  - tools  
  - news
  - opinions 
coverImage: /assets/posts/heliara-ai-revibyte-save-cover.jpg  
coverImageAlt: "Heliara AI and ReviByte Save — two new free tools built into ReviByte"  
featured: false  
draft: false  
---  
  
162 days in and ReviByte is still standing. No team, no studio — just a Physics background, and a stubbornness I can't shake. If you've been here since the start, you know [this blog launched in December 2025](/posts/first-post-revibyte-live/) and has been grinding steadily — from the [121-day milestone](/posts/revibyte-121-days-later/) to [breaking into Google search](/posts/how-revibyte-expanded-search-visibility/). Today I'm adding two things I built entirely on mobile. They're live, they're free, and they're not going anywhere.  
  
---  
## Table of Contents 

## Heliara AI — ReviByte's Built-In AI Assistant  
  
### What it is  
  
Heliara AI is a floating AI chat assistant built directly into ReviByte. The purple button in the bottom-right corner of every page — that's it. Tap it, ask anything, get an answer. No separate app, no account, no new tab.  
  
What separates it from just using ChatGPT is that Heliara reads ReviByte content in real time before answering. Every time you send a message, it fetches the ReviByte homepage and the most relevant posts for your query, strips them to plain text, and feeds that as live context into the AI. So when you ask about the best phone under ₦150k or a COD Mobile loadout, it's answering from actual ReviByte content — not just from general AI training data.  
  
### How I built it  
  
The idea was simple. The execution was not.  
  
I started with the Claude API — built a full chat widget called `ChatWidget.astro` and an endpoint at `src/pages/api/chat.ts`. Widget worked. API endpoint returned a clean JSON response. Done, I thought.  
  
Then I opened the site and got: **Network error. Check your connection and try again.**  
  
The problem wasn't the widget. It was that ReviByte runs fully static on Astro 5 — and in Astro 5, API routes simply don't work unless you explicitly tell the file to opt out of static rendering. The fix was one line at the top of the API file:  
  
```ts  
export const prerender = false;  
```  
  
That one line unlocked everything. Without it, Vercel was treating the API route as a static page and returning a 404 on every POST request.  
  
After that I switched from Claude to Google Gemini because it has a free tier. Gemini connected — but immediately hit 429 rate limit errors from all the testing. Switched to Groq, which gives 14,400 free requests per day and is genuinely faster. Used `llama-3.3-70b-versatile` as the model.  
  
Then came the system prompt. Early versions had the AI making things up — including inventing a founder called "Bright Chucks" which is not me. I rewrote the system prompt with accurate ReviByte context: iSamuel is the sole founder, the blog launched December 2025, the gaming hubs are at `/codm/` and `/efootball/`, Nigerian market focus, self-taught Astro development on mobile. That grounded it properly.  
  
The live content fetching came last. I added a function that pulls the sitemap, scores post URLs against the user's query by matching slug keywords, fetches the top two most relevant posts, strips the HTML to plain text, and injects up to 6,000 characters of live ReviByte content into every system prompt. Now when you ask Heliara something, it's reading the blog the same moment you are.  
  
The widget itself — `HeliaraAI.astro` — is a fully self-contained Astro component with its own scoped CSS and TypeScript. Dark background, purple accent, animated pulse ring on the button, bouncing typing dots, suggestion chips, close-on-outside-click, session memory. Built and debugged entirely from GitHub's browser interface on mobile.  
  
### How to use Heliara AI  
  
1. Tap the purple button at the bottom-right of any ReviByte page  
2. Ask anything — phones, Android, COD Mobile, eFootball, general tech  
3. Read the answer, ask follow-ups if needed  
4. Close it when you're done  
  
Chat history lives only in your browser session and clears when you leave. Nothing is stored on any server. Full details at [revibyte.blog/heliara/](/heliara/).  
  
---  
  
## ReviByte Save — Download TikTok Videos Without Watermark  
  
### What it is  
  
ReviByte Save is a free media downloader tool suite. The first tool is a TikTok downloader at [revibyte.blog/save-tok/](/save-tok/). Paste a TikTok link, tap Download, choose between the video without watermark or the audio as an MP3. That's it.  
  
No misleading buttons. No fake download prompts. No app install. Just paste and download.  
  
### How I built it  
  
I almost didn't name it ReviByte Save. It started as just "TikTok Saver" — a standalone page. Then I realised a generic name like that would never stick and wouldn't scale. ReviByte Save makes it a product. It means I can add YouTube, Instagram Reels, and Twitter/X downloads under the same brand later — all living at [revibyte.blog/save/](/save/) as a hub.  
  
The backend uses RapidAPI to fetch video data. The API returns the video metadata — title, author, cover image, play count, like count — and the actual download URLs for the no-watermark video and the audio.  
  
The cover image was its own problem. TikTok's CDN blocks direct image loading from external domains, so the thumbnail just wouldn't show. I built a server-side image proxy at `src/pages/api/img-proxy.ts` that fetches the image from TikTok's CDN and serves it through ReviByte's own domain. Whitelist-only — it only allows known TikTok CDN hostnames, so it can't be abused.  
  
The frontend is a single Astro page with a clean red/orange TikTok-style gradient, an input field that auto-pastes from clipboard if you've already copied a TikTok link, a spinning loader while it fetches, a result card with the video thumbnail, author, title, and stats, and two download buttons.  
  
The FAQ section uses native HTML `<details>` elements — no JavaScript needed for the accordion. Early versions had the FAQ answers not showing at all when opened. Turned out Tailwind's base reset was collapsing the `<p>` tags inside `<details>`. Fixed with `display: block !important` and explicit color overrides.  
  
For the same reason Tailwind kept fighting the text colors across the whole page — dark text on dark background, invisible stats, black FAQ answers. Every text element that needed to be visible got `color: inherit !important` or an explicit hex color with `!important` to override Tailwind's reset.  
  
### How to download a TikTok video  
  
1. Open TikTok, find the video you want  
2. Tap **Share** → **Copy link**  
3. Go to [revibyte.blog/save-tok/](/save-tok/)  
4. Paste the link — on Android it auto-fills from clipboard  
5. Tap **Download**  
6. Choose **Video (No Watermark)** or **Audio (MP3)**  
  
ReviByte Save is for personal use. Download your own content, save clips for offline, extract audio you like. Commercial redistribution of other creators' content is not what this is for.  
  
YouTube and Instagram Reels are next on the list.  
  
---  
  
## The bigger picture  
  
Both tools came out of the same thinking that's driven everything on ReviByte — solve a real problem cleanly, build it yourself, ship it. The same way I [fixed the image sitemap from scratch](/posts/how-i-fixed-google-image-sitemap--astro/) and [sorted push notifications after they broke completely](/posts/why-my-blog-had-no-push-notifications) — these tools got built one problem at a time, from a phone, until they worked.  
  
The AI question, the 404 errors, the Gemini rate limits, the Tailwind color wars, the TikTok CDN blocks — every one of those was a wall I hit on mobile with no laptop fallback. And every one of them eventually had a solution.  
  
That's still the only way I know how to build things. [Same approach that went into the Astro setup from day one](/posts/building-lightning-fast-blog-with-astro-complete-setup/).  
  
Heliara AI is live on every page. ReviByte Save is at [/save-tok/](/save-tok/). Both are free, both require nothing from you to use.  
  
162 days down.  
  
— iSamuel  
