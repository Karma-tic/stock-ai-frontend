import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SEOProps = {
  title: string;
  description: string;
  canonicalPath?: string;
  type?: 'website' | 'article';
};

const SITE_URL = 'https://byteplay.org';

function upsertMeta(selector: string, createAttrs: Record<string, string>, content: string) {
  let tag = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    Object.entries(createAttrs).forEach(([key, value]) => tag?.setAttribute(key, value));
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function SEO({
  title,
  description,
  canonicalPath,
  type = 'website',
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const path = canonicalPath || location.pathname;
    const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;

    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description' }, description);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, type);
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonicalUrl);
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [canonicalPath, description, location.pathname, title, type]);

  return null;
}
