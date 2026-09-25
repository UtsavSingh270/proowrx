export function buildSeoMetadata(seo = {}, defaults = {}, path = '/') {
  const title = seo.title ? { absolute: seo.title } : defaults.title;
  const description = seo.description || defaults.description;
  const canonical = seo.canonical || defaults.alternates?.canonical || path;
  const keywords = [seo.primaryKeywords, seo.secondaryKeywords].filter(Boolean).join(',').split(',').map(word => word.trim()).filter(Boolean);
  const shareTitle = seo.ogTitle || seo.title || defaults.openGraph?.title || (typeof title === 'string' ? title : title?.absolute);
  const shareDescription = seo.ogDescription || seo.description || defaults.openGraph?.description || description;
  const images = seo.ogImage ? [{ url: seo.ogImage }] : defaults.openGraph?.images;
  return {
    ...defaults, title, description,
    keywords: keywords.length ? [...new Set(keywords)] : defaults.keywords,
    alternates: { ...defaults.alternates, canonical },
    robots: { index: !seo.noindex, follow: !seo.nofollow },
    openGraph: { ...defaults.openGraph, title: shareTitle, description: shareDescription, url: canonical, images },
    twitter: { ...defaults.twitter, card: 'summary_large_image', title: shareTitle, description: shareDescription, images: images?.map(image => typeof image === 'string' ? image : image.url) },
  };
}
