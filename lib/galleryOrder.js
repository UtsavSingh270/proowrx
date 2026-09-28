// Legacy images keep their existing order until a device-specific position is set.
export function getGalleryOrder(item, device = 'desktop') {
  const value = item[device === 'mobile' ? 'mobileOrder' : 'desktopOrder'];
  if (value != null && value !== '' && Number.isFinite(Number(value))) return Number(value);
  return Number.isFinite(Number(item.order)) ? Number(item.order) : 0;
}

export function sortGalleryImages(items, device = 'desktop') {
  return [...items].sort((a, b) => getGalleryOrder(a, device) - getGalleryOrder(b, device)
    || (Number(a.order) || 0) - (Number(b.order) || 0)
    || String(a.createdAt || '').localeCompare(String(b.createdAt || ''))
    || String(a._id || '').localeCompare(String(b._id || '')));
}
