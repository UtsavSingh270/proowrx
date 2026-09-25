'use client';

/* eslint-disable @next/next/no-img-element -- The local upload preview uses an ephemeral blob URL. */

import React, { useEffect, useRef, useState } from 'react';
import { Upload, Link as LinkIcon, FileText, Video } from 'lucide-react';

function getAssetPreview(value) {
  if (typeof File !== 'undefined' && value instanceof File) {
    return {
      type: 'file',
      label: value.name,
      url: '',
    };
  }

  if (value && typeof value === 'object' && typeof value.secure_url === 'string') {
    return {
      type: 'asset',
      label: value.original_filename || value.public_id || value.secure_url.split('/').pop(),
      url: value.secure_url,
    };
  }

  const stringValue = String(value || '').trim();
  if (!stringValue) return { type: 'empty', label: '', url: '' };

  return {
    type: 'url',
    label: stringValue.split('/').pop(),
    url: stringValue,
  };
}

export default function FileUploadInput({
  value = '',
  onChange,
  label = 'File',
  accept = '*/*',
  placeholder = 'Choose file from device',
  allowUrl = true,
  description = '',
}) {
  const [mode, setMode] = useState(allowUrl ? 'url' : 'upload');
  const [error, setError] = useState('');
  const [blobPreview, setBlobPreview] = useState(null);
  const inputRef = useRef(null);

  const currentPreview = getAssetPreview(value);
  const previewUrl = currentPreview.type === 'file' ? (blobPreview?.file === value ? blobPreview.url : '') : currentPreview.url;
  const fileName = currentPreview.label;

  useEffect(() => {
    if (typeof File !== 'undefined' && value instanceof File) {
      const url = URL.createObjectURL(value);
      // The preview synchronizes React with a browser-owned resource, created after commit.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlobPreview({ file: value, url });
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  function handleUrlChange(e) {
    setError('');
    onChange(e.target.value);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setMode('upload');
    onChange(file);
  }

  const hasPreview = !!previewUrl;

  return (
    <div className="dash-form-group">
      <label className="dash-form-label">{label}</label>

      {allowUrl && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            type="button"
            className={`dash-btn ${mode === 'upload' ? 'dash-btn-primary' : 'dash-btn-ghost'} dash-btn-sm`}
            onClick={() => setMode('upload')}
          >
            <Upload size={13} /> Upload
          </button>
          <button
            type="button"
            className={`dash-btn ${mode === 'url' ? 'dash-btn-primary' : 'dash-btn-ghost'} dash-btn-sm`}
            onClick={() => setMode('url')}
          >
            <LinkIcon size={13} /> URL
          </button>
        </div>
      )}

      {mode === 'upload' ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="dash-btn dash-btn-ghost"
            onClick={() => inputRef.current?.click()}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Upload size={13} /> {fileName || placeholder}
          </button>
        </div>
      ) : (
        <input
          className="dash-form-input"
          type="url"
          value={typeof value === 'string' ? value : ''}
          onChange={handleUrlChange}
          placeholder={placeholder}
        />
      )}

      {description && <div style={{ color: '#6b7a99', fontSize: '0.82rem', marginTop: 8 }}>{description}</div>}

      {error && <div style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 8 }}>{error}</div>}

      {hasPreview && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {previewUrl.match(/\.(pdf)$/i) ? (
            <a href={previewUrl} target="_blank" rel="noreferrer" className="dash-form-link">
              <FileText size={14} style={{ verticalAlign: 'middle' }} /> View PDF: {fileName || 'Download'}
            </a>
          ) : previewUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
            <img
              src={previewUrl}
              alt={fileName || 'preview'}
              style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 10, border: '1px solid #e5e9f0' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : previewUrl.match(/\.(mp4|webm|mov|mkv)$/i) ? (
            <div style={{ fontSize: '0.9rem', color: '#374a6e' }}>
              <Video size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> {fileName || previewUrl.split('/').pop()}
            </div>
          ) : (
            <div style={{ fontSize: '0.9rem', color: '#374a6e' }}>
              <FileText size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} /> {fileName || previewUrl}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
