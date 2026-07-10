---
layout: page
title: Free Runner
description: 💚 For the joy of running
permalink: /freerunner/
_styles: |
  .freerunner-banner {
    position: relative;
    margin-bottom: 2rem;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
  }
  .freerunner-banner img.freerunner-banner-bg {
    width: 100%;
    display: block;
  }
  .freerunner-banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(27, 94, 32, 0.15) 0%, rgba(27, 94, 32, 0.75) 100%);
  }
  .freerunner-hero {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    color: #ffffff;
  }
  .freerunner-hero img {
    width: 96px;
    height: 96px;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    flex-shrink: 0;
  }
  .freerunner-hero h2 {
    margin: 0 0 0.25rem 0;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .freerunner-hero .freerunner-heart {
    font-size: 0.85em;
    vertical-align: middle;
  }
  .freerunner-tagline {
    margin: 0 0 0.5rem 0 !important;
    font-size: 1.35rem;
    font-weight: 600;
    font-style: italic;
    color: #C8E6C9 !important;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  .freerunner-hero p:not(.freerunner-tagline) {
    margin: 0;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
  .freerunner-features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0 2rem;
  }
  .freerunner-features .card {
    border: 1px solid #C8E6C9;
    border-left: 4px solid #2E7D32;
    border-radius: 8px;
    padding: 1rem;
    background: #FAFAFA;
  }
  .freerunner-features .card strong {
    color: #1B5E20;
  }
  .freerunner-policy {
    background: #FAFAFA;
    border: 1px solid #E0E0E0;
    border-top: 4px solid #FF6F00;
    border-radius: 8px;
    padding: 1.5rem 2rem;
    margin: 1rem 0;
  }
  .freerunner-policy h2 {
    color: #1B5E20;
  }
  .freerunner-policy ul li::marker {
    color: #2E7D32;
  }
  .freerunner-contact {
    margin-top: 2rem;
    padding: 1rem 1.5rem;
    background: #F1F8E9;
    border-radius: 8px;
    color: #1B5E20;
  }
  .freerunner-section-title {
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 0.25rem;
    color: #1B5E20;
  }
  @media (max-width: 576px) {
    .freerunner-hero {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
    .freerunner-hero img {
      width: 64px;
      height: 64px;
    }
  }
---

<div class="freerunner-banner">
  <img class="freerunner-banner-bg" src="{{ 'assets/img/freerunner_hero_wide.png' | relative_url }}" alt="Free Runner" loading="lazy">
  <div class="freerunner-banner-overlay"></div>
  <div class="freerunner-hero">
    <div>
      <h2>Free Runner 💚</h2>
      <p>A free, privacy-first running tracker that keeps all your data on your device.</p>
    </div>
  </div>
</div>

## <span class="freerunner-section-title">Features</span>

<div class="freerunner-features">
  <div class="card">
    <strong>GPS Tracking</strong><br>
    Real-time pace and distance.
  </div>
  <div class="card">
    <strong>Route Maps</strong><br>
    OpenStreetMap, off by default.
  </div>
  <div class="card">
    <strong>Run History</strong><br>
    Stats and personal notes.
  </div>
  <div class="card">
    <strong>Data Export</strong><br>
    Export your runs as Markdown.
  </div>
  <div class="card">
    <strong>Offline First</strong><br>
    No internet required.
  </div>
  <div class="card">
    <strong>Always Free</strong><br>
    All features unlocked.
  </div>
</div>

<div class="freerunner-policy" markdown="1">

## Privacy Policy

Last updated: July 10, 2026

Free Runner does not collect, transmit, or store any personal data on external
servers. All run data is stored locally on your device using an on-device database.

- **No analytics.** The app contains no analytics SDKs and does not track your behavior.
- **No advertising identifiers.** No ad networks are used.
- **No user accounts.** There is no sign-up, login, or account system.
- **No background network requests.** The only network access is optional OpenStreetMap map tiles, which are off by default.
- **Location data** is used solely for run tracking and is stored only on your device. It is never transmitted anywhere unless you choose to enable map tiles or export a run yourself.
- **Map tiles.** If you enable map tiles, those tile requests reveal your IP address and the area you view to the OpenStreetMap servers. This is the only circumstance under which any data leaves your device, and it is entirely under your control.

### Data Storage and Deletion

All of your data lives in a local database on your device. It is never synced to any server. You can export and delete all of your data at any time from within the app.

### Children's Privacy

Free Runner is rated 4+ and is safe for all ages. No personal data is collected from anyone, including children.

### Changes to This Policy

If the data practices of Free Runner ever change, this policy will be updated on this page.

</div>

<div class="freerunner-contact" markdown="1">

If you have any questions about this privacy policy, please contact [josh.peterson@hey.com](mailto:josh.peterson@hey.com).

</div>
