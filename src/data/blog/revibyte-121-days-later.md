---
title: "121 Days of ReviByte — What iSamuel Has Built, Learned, and Won't Stop Doing"
description: "From a single 'Hello World' post on December 15, 2025, to a Microsoft Store app, 57 published posts, and a blog that refused to die — here's what 121 days of ReviByte looks like."
pubDatetime: 2026-04-15T04:15:00Z
author: iSamuel
tags: [news, opinions, update]
coverImage: /assets/posts/revibyte-121-days-milestone.jpg
coverImageAlt: "ReviByte 121 days milestone — December 2025 to April 2026"
---

## Table of Contents 

## Overview 

It started with three sentences and a prayer.

On December 15, 2025, I published the first post on ReviByte. No traffic, no audience, no
guarantee it would work. Just a blank Astro blog, a domain, and a stubborn conviction that
honest tech opinions deserve a real home on the internet.

That was 121 days ago. Today — April 15, 2026 — I'm still here. And ReviByte is more alive
than ever.

## Who Is iSamuel?

Let me be direct: iSamuel isn't just a pen name. It's a brand identity I'm building
deliberately — a long-term bet on my own voice in a space crowded with spec-sheet recyclers
and PR-friendly reviewers.

I'm a Physics and Electronics student. I build things from scratch. I debug code at midnight.
I care deeply about how tech actually functions in the hands of everyday people — especially
in Nigeria and across Africa, where the $200 midrange phone isn't a "budget option," it's a
serious decision.

ReviByte is the intersection of all of that. The technical understanding. The local context.
The refusal to be neutral when a product deserves a real verdict.

## What 121 Days Looked Like

The first post was simple — almost embarrassingly so. "Welcome to ReviByte. More fire reviews
are coming soon." That was it.

What came after wasn't simple at all.

I rebuilt internal link structures. Fixed a trailing slash bug that was silently breaking
Google indexing. Built a custom image sitemap from scratch. Debugged structured data until
breadcrumbs showed correctly in Search Console. Wrote guides on Call of Duty: Mobile,
published Android optimization posts, covered the Samsung Galaxy S26 Ultra, compared Infinix
and Tecno devices for real Nigerian buyers.

Every post was written by me. Every technical fix was figured out by me. No team. No budget.
Just conviction and iteration.

## 57 Posts in 121 Days

Let that number sit for a second.

57 published posts. That's roughly one post every two days, maintained by a single person
who is also a full-time university student studying Physics and Electronics.

Not 57 thin, recycled articles. 57 pieces with real structure — comparison tables, FAQ
sections, inline images, internal links, SEO metadata, all handled manually. Posts about
Android optimization, Nigerian device comparisons, Call of Duty: Mobile guides, Samsung
flagships, budget phone verdicts, AI tools, eFootball reviews, and more.

Each one researched. Each one written in my own voice. Each one published with the intention
of actually being useful to whoever lands on it.

The most recent one, published just yesterday on April 13 — the
[eFootball 2026 Mobile review](/posts/efootball-2026-mobile-real-football-or-scripted) — is
a good example of what ReviByte is. Not a press release. Not a summary of other people's
takes. A real verdict from someone who actually played the game for three months, got
frustrated by it, kept coming back, and decided to write honestly about both sides of that
experience.

57 is not an accident. It's what consistency looks like when you refuse to stop.

## The Bugs That Almost Broke Everything

There were moments — real, quiet moments — where the technical problems felt bigger than the
mission.

One of the worst was a trailing slash mismatch buried inside `getPath.ts`. Every internal
post link on the site was silently redirecting. Users landing on posts were getting bounced.
Google's crawler was treating every link as broken. I had to trace it through the Astro build
logic, find the exact mismatch, and fix it without breaking everything else.

Then there was the sitemap. A malformed template literal inside `astro.config.ts` meant tag
pages were being excluded entirely from the sitemap Google was reading. Tag pages are
indexable traffic. They were invisible.

The image indexing problem took longer to diagnose. My post cover images were showing up on
Google fast — but pointing to my homepage instead of the actual posts. Google had no idea
which image belonged to which page. I built a custom image sitemap from scratch —
`sitemap-post-images.xml.ts` — that explicitly maps every post URL to its cover image with
full absolute paths. The result: 39 images confirmed in Google Search Console, each correctly
tied to the right post. The full story is in
[how I fixed the Google image sitemap on my Astro blog](/posts/how-i-fixed-google-image-sitemap--astro).

And then there was push notifications — arguably the most quietly embarrassing bug of all.
ReviByte had a notification bell on the homepage from nearly the beginning. Subscribers were
opting in. People were clicking "Allow." And when I published new posts, absolutely nothing
was being sent. Zero. I had OneSignal installed and functioning, but there was no bridge
between publishing and actually notifying anyone. I eventually fixed it with a Zapier
automation that watches the RSS feed and fires OneSignal on every new post. The full
breakdown is in
[why my blog had no push notifications for months](/posts/why-my-blog-had-no-push-notifications).

None of these fixes came with tutorials. I figured them out line by line. And I documented
all of it — because if I hit these problems, other builders will too.

## I Also Built with AI — and Wrote About It Honestly

One of the posts I'm most proud of from this stretch is
[how I use ChatGPT and Claude to run my blog faster](/posts/how-i-use-chatgpt-and-claude-to--run-my-blog-faster).

It would've been easy to write a shallow "AI made my workflow 10x faster" piece. I didn't
do that. The honest version is more complicated: ChatGPT is where I work out angles, react to
structures, and generate FAQ questions I might overlook as someone already deep in a topic.
Claude is where I bring code problems — the sitemap TypeScript, the schema markup, the Astro
config debugging — when I need to understand *why* something is broken, not just what to
change.

The actual writing? That's mine. Always. The opinions, the Nigerian market framing, the voice
— those don't get delegated. That post lays out exactly where the line is and why it matters.

## ReviByte Launched on the Microsoft Store

On March 6, 2026 — exactly 82 days after the blog went live — ReviByte became an app.

I submitted ReviByte to the Microsoft Store via PWABuilder and it was approved and published.
You can download it right now on any Windows device:
[get ReviByte from the Microsoft Store](https://apps.microsoft.com/detail/9P24DH9BH6SH).

Let me be clear about what that means and what it doesn't. This isn't a native desktop app
with a dedicated codebase. It's ReviByte's PWA — the same fast, installable, offline-capable
web app that already runs on mobile — packaged properly for the Microsoft Store. The PWA is
already active on ReviByte's platform. If you're on Android or any mobile browser, you can
install it directly from the site right now without going through any store.

But being on the Microsoft Store is still a real milestone. It's a distribution channel. It
makes ReviByte discoverable to Windows users who would never find it through Google. It means
ReviByte has a presence on a platform that serves hundreds of millions of devices.

And it's not the end goal for apps.

The next target is Google Play Store. Getting ReviByte listed as a proper Android app —
discoverable through search, installable in one tap, familiar to every Android user who's
ever downloaded anything — that's the plan. The PWA foundation is already there. The work
now is on the packaging, the Play Store developer account, and the submission process. It's
coming.

## The Moment I Wanted to Quit

I'll be honest because that's what ReviByte is built on — honesty.

There was a stretch, maybe six weeks in, where I genuinely questioned whether any of this was
worth it. The blog was technically functional. Posts were going up. But traffic was flat.
Google hadn't fully indexed half the site. I was spending hours on fixes that felt invisible.
No comments. No shares. No signal that anyone outside my own screen was reading a single word.

I remember sitting with the dashboard open — Search Console showing crawl errors, analytics
showing near-zero — and thinking: *maybe this was a bad idea.*

What kept me going wasn't motivation. Motivation is unreliable. What kept me going was
structure. I had a posting schedule. I had a technical checklist. I had a standard for what
each post had to be before it went live. I followed the process even when the results weren't
visible yet.

And slowly, they became visible.

That's the part nobody tells you about building something from scratch. The work you do when
nothing is working is the work that makes everything work later. I didn't quit. ReviByte is
still here because I didn't quit.

## The Posts That Meant the Most

Some posts were purely technical exercises. Others felt personal.

The [Call of Duty: Mobile discipline post](/posts/what-call-of-duty-mobile-taught-me-about-real-life-discipline)
was one of those — a piece about what a mobile shooter actually teaches you about patience,
decision-making, and self-control. It's not the kind of post most tech blogs would publish.
ReviByte published it because it was true.

The [Tecno Camon 30 Pro hidden features guide](/posts/tecno-camon-30-pro-hidden-features) went
up early and became one of the first posts that showed me this blog could actually reach the
right people — users who own that phone, who want real value from it, who don't see themselves
reflected in flagship-only tech coverage.

Those two posts defined what ReviByte is.

## What Hasn't Changed

The mission hasn't shifted a single degree since day one.

Clean, honest, sharp tech opinions. No fluff. No artificial neutrality. No pretending a bad
phone is decent because a brand sent a press release. ReviByte exists to tell you what
something actually is — whether that's a flagship worth its price, a budget phone that
punches above its weight, a game worth your time, or a tool worth learning.

iSamuel will keep writing that. For the next 121 days, and the 121 after that.

## This Is Where You Come In

ReviByte isn't a corporate media outlet. There's no marketing team pushing posts. No ad spend
boosting reach. Every person who discovers this blog does so because another real person
decided it was worth sharing.

That person can be you.

If a post helped you decide on a phone — share it. If a guide saved you time — share it. If
you've been reading quietly since December and thought "this blog is actually good" — tell
someone. Drop a link in your WhatsApp group. Share it on X. Post it to your Facebook page.
One share from you reaches people ReviByte cannot reach alone.

And if you want to go deeper — leave a comment. Ask a question. Tell me what device you want
covered next, what Android issue you're dealing with, what game you want reviewed honestly.
I read everything. I respond. This blog is a conversation, not a broadcast.

[Join the ReviByte WhatsApp Channel](https://whatsapp.com/channel/0029VbBCXzRKAwEdcyip8841)
for instant updates when new posts drop. Subscribe to the newsletter below if you'd rather
get them by email. And if you're on Windows — download the
[ReviByte app from the Microsoft Store](https://apps.microsoft.com/detail/9P24DH9BH6SH)
and have the blog on your desktop.

57 posts in 121 days was built for you. Help me make sure it reaches you.

## If You've Been Here Since December

Then you already know. You watched this thing get built in public, post by post, fix by fix,
milestone by milestone.

Thank you for reading. Thank you for sharing. Thank you for every page view that told me this
was worth continuing.

ReviByte is not stopping.

— *iSamuel, Founder, ReviByte*
