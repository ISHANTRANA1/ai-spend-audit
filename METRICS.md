# METRICS.md

## North Star Metric
**Audits completed per week**

Why: An audit completed means a user entered real data and saw real results — the core value has been delivered. Email captures and consultations are downstream. Visits and pageviews are upstream. Audits completed is the moment of truth. For a B2B lead-gen tool at pre-scale, this is also the metric most directly in our control.

## 3 Input Metrics

1. **Audit start rate** (visits → audit page): Measures landing page effectiveness and traffic quality. Target: >40%. If this drops, the hero copy or CTA is failing.

2. **Audit completion rate** (audit started → result viewed): Measures form friction. Target: >70%. If this drops, the form is too long or confusing — simplify or add autosave indicators.

3. **Share rate** (result viewed → share link clicked): Measures viral coefficient. Target: >10%. This drives organic growth. If this is low, the results page isn't visually shareable enough — improve the savings hero.

## What We'd Instrument First

1. `audit_started` event — timestamp, referrer source (HN? Twitter? direct?)
2. `audit_completed` event — tool count, total spend entered, use case
3. `savings_shown` event — savings tier (high/medium/low/optimal), monthly savings amount
4. `email_captured` event — with savings tier so we know which audits convert
5. `share_clicked` event — result ID so we can track downstream visits from shares

All events to a simple Postgres table or Posthog (free tier). No Mixpanel at this stage.

## Pivot Trigger Number

If **audit completion rate drops below 50%** for two consecutive weeks: the form is broken or the user expectation set by the landing page doesn't match the product. Time to either simplify the form to 3 fields or rewrite the landing page copy to set better expectations.

If **email capture rate drops below 15%**: the post-audit results aren't delivering enough perceived value. Either the savings are too small (need better/more aggressive rules) or the results UI is confusing.
