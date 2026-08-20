# V5.5.1 — CSS/JS load hotfix

Hotfix after V5.5.0 preview deployment rendered without styles.

- Restored the proven asset URLs (`assets/css/styles.css` and original JS filenames).
- Kept the resource contents minified, so Semrush can still detect minified CSS/JS.
- Updated cache-busting to `v=5.5.1`.
- Updated the service-worker cache name and core asset paths.
- Preserves the V5.5.0 SEO/Semrush fixes (llms.txt, host cleanup, schema/hreflang work, etc.).
