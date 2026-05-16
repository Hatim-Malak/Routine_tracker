import { useEffect } from "react";

const upsertMeta = (name, content, attr = 'name') => {
  if (!content && content !== 0) return;
  let el = document.head.querySelector(`meta[${attr}='${name}']`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let el = document.head.querySelector(`link[rel='${rel}']`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const Seo = ({ title, description, url, image, canonical, structuredData }) => {
  useEffect(() => {
    if (title) document.title = title;

    upsertMeta('description', description || 'Track your daily routines and build streaks with Task Tracker.');
    upsertMeta('og:title', title || 'Task Tracker', 'property');
    upsertMeta('og:description', description || 'Track your daily routines and build streaks with Task Tracker.', 'property');
    upsertMeta('og:type', 'website', 'property');
    if (url) upsertMeta('og:url', url, 'property');
    if (image) upsertMeta('og:image', image, 'property');
    upsertMeta('twitter:card', image ? 'summary_large_image' : 'summary', 'name');
    upsertMeta('twitter:title', title || 'Task Tracker', 'name');
    upsertMeta('twitter:description', description || 'Track your daily routines and build streaks with Task Tracker.', 'name');
    if (image) upsertMeta('twitter:image', image, 'name');

    if (canonical) upsertLink('canonical', canonical);

    // JSON-LD structured data
    if (structuredData) {
      let script = document.head.querySelector('script[type="application/ld+json"][data-generated="seo"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-generated', 'seo');
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(structuredData);
    }

    return () => {
      // no-op: keep meta tags so SPA navigations continue to benefit
    };
  }, [title, description, url, image, canonical, structuredData]);

  return null;
};

export default Seo;
