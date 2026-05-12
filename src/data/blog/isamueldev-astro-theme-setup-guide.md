---
title: "I Built a Free Astro Blog Theme From Scratch — And You Can Use It Right Now"
description: "No agency, no team, no laptop. I built a complete production-ready Astro blog theme entirely on mobile. Here's the full setup guide so you can deploy yours today."
pubDatetime: 2026-05-12T23:22:00Z
tags: ["astro", "opinions", "productivity", "technology"]
author: iSamuel
featured: false
draft: false
coverImage: "https://www.revibyte.blog/assets/posts/isamuel-revibyte-workflow-desk.jpg"
coverImageAlt: "Code editor showing Astro framework setup"
---

## Table of Contents 

## Overview 

Something I want to say before we get into this.

I built this theme on a phone. Not as a flex — just so you understand what "built from scratch" actually means here. No VS Code open on a MacBook. No terminal. No npm running locally. Every file was created through GitHub's browser interface, committed one by one, and deployed automatically through Vercel. I'm a Physics and Electronics student running ReviByte solo, and I built this because I understood Astro well enough after months of working inside AstroPaper to stop modifying someone else's code and start writing my own.

The theme is called **iSamuelDev**. It's live, it's free, it's open source, and you can have your blog running on it before the end of today. This is the setup guide.

---

## What the Theme Includes

Let me be specific about what you're getting — not a vague feature list, actual pages and functionality.

**Every page is already built:**

The homepage shows your newest post as a full-width hero with the cover image, gradient overlay, tags, title, description, author and date all sitting on top of the image. Below that is a two-column recent posts grid with thumbnails, tags, and dates. At the bottom is a View All Posts button.

The blog list at `/blog/` shows all your posts with small thumbnails on the left and title, tags, description, date on the right. It paginates automatically once you pass six posts.

Individual post pages at `/blog/[slug]/` have reading time in the meta line, a table of contents that only appears when the post has three or more headings, share buttons for Twitter/X and WhatsApp and copy link sitting above the cover image, related posts matched by shared tags at the bottom, breadcrumbs with JSON-LD schema, and a floating back to top button.

The tags system has an index at `/tags/` showing every tag with post counts, and individual tag pages at `/tags/[tag]/` listing all posts under that tag.

There's also an author page, about page, contact page with a working form via Formspree, privacy policy, terms and conditions, disclaimer, a custom 404 page, and an offline page for when the PWA loses connection.

**What runs automatically:**

Every time you publish a post, the sitemap at `/sitemap.xml` updates, the image sitemap at `/sitemap-images.xml` updates, and the RSS feed at `/rss.xml` updates. The search index at `/search-index.json` that powers the live search in the header updates too. You never touch any of these manually.

**SEO that's already set up:**

Canonical URLs on every page. OG tags and Twitter cards with the post cover image as the OG image. robots.txt pointing to your sitemaps. Breadcrumb JSON-LD schema on posts. Article JSON-LD schema with author, publisher, date published and date modified. Google Search Console verification support through the config file.

**PWA:**

The site installs as an app on Android and iOS. There's a manifest.json with theme color, a service worker with network-first strategy for HTML pages and cache-first for assets, and an offline page that shows when the connection drops.

---

## What You Need Before Starting

Three things:

A GitHub account. A Vercel account connected to that GitHub account. Your content.

That's the entire list. No Node.js. No npm. No code editor. Everything runs through GitHub's browser interface and Vercel's build pipeline — the same way I built the theme itself.

---

## Step One: Fork the Repo

Go to the GitHub repository:

👉 **[github.com/bytecascade11/isamueldev](https://github.com/bytecascade11/isamueldev)**

Tap Fork in the top right corner. GitHub copies the entire repo to your account. Name it whatever makes sense for your project — the repo name doesn't affect your site URL.

---

## Step Two: Deploy to Vercel

Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.

Tap **Add New Project** → **Import Git Repository** → find the repo you just forked → tap **Import**.

Leave every setting on the configuration screen exactly as it is. Vercel detects Astro automatically and knows the build command, output directory, everything. Tap **Deploy**.

Your site goes live at `your-repo-name.vercel.app` in about 90 seconds. From this point forward every commit you push to your main branch triggers an automatic rebuild and redeploy. You never need to touch Vercel again unless you want to connect a custom domain.

---

## Step Three: Configure Everything From One File

Open `src/config.ts` in your forked repo on GitHub. This is the only file you need to edit to make the theme completely yours. Tap the pencil icon and update it:

```ts
export const SITE = {
  name: "YourBlog",
  tagline: "Your blog tagline here.",
  url: "https://your-repo-name.vercel.app",
  description: "Your site description for SEO.",
  author: "Your Name",
  email: "you@email.com",

  nav: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog/" },
    { label: "Tags", href: "/tags/" },
    { label: "About", href: "/about/" },
  ],

  socials: {
    twitter: "https://twitter.com/yourusername",
    github: "https://github.com/yourusername",
    whatsapp: "",
    instagram: "",
  },

  ogImage: "/og-default.png",
  googleVerification: "",

  postsPerPage: 6,
  showReadingTime: true,
  showTableOfContents: true,
  showRelatedPosts: true,
  showShareButtons: true,
};
```

The `url` field is the most important one. It must match your actual Vercel URL exactly — no trailing slash. This field generates your canonical URLs, your OG image URLs, your sitemap entries, and your RSS feed links. If it's wrong those all break silently.

The `googleVerification` field stays empty until you verify your site in Google Search Console — we'll get to that later.

Commit the file. Vercel rebuilds. Your name, tagline, socials, and site URL now flow through the entire site automatically — header, footer, meta tags, RSS feed, JSON-LD schema, everything.

---

## Step Four: Update the Pages

Open `src/pages/about.astro` and replace the placeholder text with your actual about content. Open `src/pages/contact.astro` and update the email address.

The contact form uses Formspree. If you want it working go to [formspree.io](https://formspree.io), create a free account, create a new form, copy the endpoint URL they give you, and replace the `action` attribute in the form tag with your endpoint. Free plan handles 50 submissions per month.

The legal pages — Privacy Policy, Terms, Disclaimer — have placeholder content that's generic enough to work as-is. Update them if your site runs ads or affiliate links.

---

## Step Five: Write Your First Post

All posts live in `src/content/blog/`. Create a new `.md` file. The filename becomes the URL slug — `my-post.md` becomes `/blog/my-post/`.

Every post needs this frontmatter at the top:

```md
---
title: "Your Post Title"
description: "One or two sentences for SEO and social previews."
date: 2024-01-01
tags: ["tag1", "tag2"]
author: "Your Name"
cover: "/images/your-cover.jpg"
featured: false
draft: false
---

Your content starts here.
```

**Things to know about the fields:**

`date` must be `YYYY-MM-DD` format. Wrong format breaks the build.

`featured: true` on one post makes it the homepage hero. Set everything else to `false`. If multiple posts have `featured: true` the most recent one wins.

`draft: true` hides a post completely — it won't appear on any page, in the sitemap, or in the RSS feed. Flip it to `false` when you're ready to publish.

`cover` is the image that appears at the top of the post, in post cards on the homepage and blog list, and as the OG image when the post is shared anywhere. Two ways to add one:

Local image — upload it to `public/images/` in your repo via **Add file → Upload files** and reference it as `/images/filename.jpg`.

Unsplash URL — paste the image URL directly and add `?w=800&auto=format&fit=crop` at the end.

---

## Step Six: Create Your OG Default Image

The homepage and pages that don't have a cover image use `/og-default.png` as the preview image when shared on WhatsApp, Twitter, LinkedIn, or anywhere else.

Go to [canva.com](https://canva.com), create a new design at exactly **1200 × 630 pixels**, design it with your site name and tagline, export as PNG, name the file `og-default.png`, and upload it to the `public/` folder in your repo.

After uploading test it at [opengraph.xyz](https://opengraph.xyz) — paste your site URL and it shows exactly how your link previews on every platform.

---

## Step Seven: Google Search Console

Once your site is live with at least one real post published, go to [search.google.com/search-console](https://search.google.com/search-console).

Add your Vercel URL as a property. Choose the HTML tag verification method. Copy the content value from the meta tag they give you — the long string between the quotes, not the full tag. Paste it into `src/config.ts` under `googleVerification`. Commit. Vercel redeploys. Go back to Search Console and tap Verify.

After verification go to Sitemaps in the left sidebar and submit:

```
sitemap.xml
sitemap-images.xml
```

Submit them one at a time. Google starts crawling within 24 to 48 hours.

---

## Step Eight: Change the Accent Color

The default color is blue. Every interactive element uses it — links, tags, hover states, the back to top button, the search focus ring, share buttons, the progress bar.

To change it open `tailwind.config.ts` and find the accent color object. Replace all the shades with your chosen color. Tailwind's full color palette with all shades is at [tailwindcss.com/docs/customizing-colors](https://tailwindcss.com/docs/customizing-colors) — find your color, copy all the shades, paste them in. Commit and the entire site updates.

---

## The Demo and the Repo

The theme is live at:

👉 **[isamueldev.vercel.app](https://isamueldev.vercel.app)**

Fork it at:

👉 **[github.com/bytecascade11/isamueldev](https://github.com/bytecascade11/isamueldev)**

I am the only contributor. Every line of code was written on a phone without a terminal. If something isn't working open an issue on GitHub and I will look at it.

If this helped you ship something — a star on the repo is genuinely appreciated and helps other developers find it.

## My Recent Posts 

[Samsung vs Apple Ecosystem in 2026](https://www.revibyte.blog/posts/samsung-vs-apple-ecosystem-2026/)

[Best Mbile games to Play with friends in 2026](https://www.revibyte.blog/posts/best-mobile-games-to-play-with-friends-2026/)
