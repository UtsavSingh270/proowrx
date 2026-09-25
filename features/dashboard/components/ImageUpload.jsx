'use client';

import { useState } from 'react';
import FileUploadInput from '@/components/shared/FileUploadInput';
import { uploadImageValue } from '@/lib/media';

// Upload immediately for fields such as social images that store a URL in SEO.
export default function ImageUpload({ value, onChange, label = 'Image', onBusyChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function select(file) {
    setBusy(true); onBusyChange?.(true); setError('');
    try { onChange(await uploadImageValue(file)); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); onBusyChange?.(false); }
  }
  return <fieldset disabled={busy} className="dash-upload-field"><FileUploadInput label={label} value={value} onChange={select} accept="image/jpeg,image/png,image/webp,image/gif" allowUrl={false} />{busy && <p role="status">Uploading image…</p>}{error && <p className="dash-login-err" role="alert">{error}</p>}</fieldset>;
}
