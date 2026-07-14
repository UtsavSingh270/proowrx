'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload } from 'lucide-react';

function getAssetPreview(value) {
  if (value instanceof File) {
    return {
      type: 'file',
      label: value.name,
      url: URL.createObjectURL(value),
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

export default function ImageUploadInput({ value = '', onChange, label = 'Image', placeholder = 'https://...' }) {
  const [mode, setMode] = useState('url');
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const currentPreview = useMemo(() => getAssetPreview(value), [value]);

  useEffect(() => {
    if (currentPreview.type === 'file') {
      setPreviewUrl(currentPreview.url);
      setFileName(currentPreview.label);
      setMode('upload');
      return () => URL.revokeObjectURL(currentPreview.url);
    }

    setPreviewUrl(currentPreview.url);
    setFileName(currentPreview.label);
    if (currentPreview.type === 'url') {
      setMode('url');
    }
  }, [currentPreview]);

  function handleUrlChange(e) {
    setError('');
    onChange(e.target.value);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    onChange(file);
  }

  return (
    <div className="dash-form-group">
      <label className="dash-form-label">{label}</label>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          className={`dash-btn ${mode === 'url' ? 'dash-btn-primary' : 'dash-btn-ghost'} dash-btn-sm`}
          onClick={() => setMode('url')}
          style={{ flex: 1 }}
        >
          URL
        </button>
        <button
          type="button"
          className={`dash-btn ${mode === 'upload' ? 'dash-btn-primary' : 'dash-btn-ghost'} dash-btn-sm`}
          onClick={() => setMode('upload')}
          style={{ flex: 1 }}
        >
          Upload
        </button>
      </div>

      {mode === 'url' && (
        <input
          className="dash-form-input"
          type="url"
          value={typeof value === 'string' ? value : ''}
          onChange={handleUrlChange}
          placeholder={placeholder}
        />
      )}

      {mode === 'upload' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="dash-btn dash-btn-ghost"
            onClick={() => fileInputRef.current?.click()}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Upload size={13} /> {fileName || 'Choose File'}
          </button>
        </div>
      )}

      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{
              maxWidth: '100%',
              maxHeight: 150,
              borderRadius: 8,
              border: '1px solid #e5e9f0',
              objectFit: 'cover'
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {error && (
        <div style={{ color: '#e74c3c', fontSize: '0.78rem', marginTop: 8 }}>
          {error}
        </div>
      )}
    </div>
  );
}
