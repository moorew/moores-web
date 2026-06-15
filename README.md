# Moores Home &amp; Garden — website

This repository is the **complete, live website** for
[mooreshomeandgarden.com](https://mooreshomeandgarden.com), served by
**GitHub Pages**. It is a plain static site — no database, no build step,
no server code. Whatever is in this folder is what the world sees.

## What's here

```
/                     the website root (this is the homepage)
  index.html          Home
  our-story.html      Our Story
  the-range.html      The Range
  fragrances.html     Fragrances
  own-branding.html   Own Branding
  consultation.html   Contact / consultation enquiry
  404.html            "page not found" page
  brand.css           all the styling for the whole site
  site.js             shared header, footer, nav, newsletter popup
  favicon.svg         the little flame icon in the browser tab
  sitemap.xml         list of pages, for Google
  robots.txt          search-engine instructions
  CNAME               tells GitHub Pages our domain is mooreshomeandgarden.com
  .nojekyll           tells GitHub Pages to serve files exactly as-is

  photos/             every photo used on the website
  email/              images used INSIDE the newsletter emails
                      (hero.jpg, feature.jpg, logos, flame-divider)
  email-tool/         the private "Email Builder" page for writing newsletters

  perfumes/  our-range/  contact/  own-branding/  ribbons/
  product-care/  downloads/  project/...
                      redirect pages for the OLD WordPress addresses Google
                      has indexed — each forwards to the matching new page so
                      no search traffic is lost. Don't delete these.
```

## The three moving parts

| Part | How it works | Needs a server? |
|------|--------------|-----------------|
| **Website** | Plain HTML/CSS/JS in this repo | No |
| **Newsletter sign-up** | EmailOctopus pop-up (their hosted form) | No |
| **Contact form** | Sends to Formspree (their hosted service) | No |
| **Email Builder** | Runs entirely in the browser; you paste the result into EmailOctopus | No |

Everything is static, which is exactly why it can live on GitHub Pages.

## Making changes

1. Edit the file (all visible text is right there in the `.html` files).
2. Commit. GitHub Pages rebuilds and publishes within ~1 minute.

Common one-place edits live at the top of **`site.js`**: phone number,
email address, postal address, and the nav links — change them once and
every page updates.

## Setup & domain

Full step-by-step instructions for putting this on GitHub Pages and
pointing the mooreshomeandgarden.com domain at it (via Cloudflare DNS)
are in the **"GitHub Pages Setup Guide"** that came with this folder.
