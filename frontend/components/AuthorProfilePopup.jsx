'use client';

import React from 'react';
import { X, Mail, Globe } from 'lucide-react';

export default function AuthorProfilePopup({ author, onClose }) {
  if (!author) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
        }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            maxWidth: 500,
            width: '100%',
            overflow: 'hidden',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid #e5e9f0',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Author Profile</h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7a99',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {/* Profile Image */}
            {author.image && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 24,
                }}
              >
                <img
                  src={author.image}
                  alt={author.name}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </div>
            )}

            {/* Name */}
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1a1f2e',
                textAlign: 'center',
              }}
            >
              {author.name}
            </h3>

            {/* Title */}
            {author.title && (
              <p
                style={{
                  margin: '0 0 16px 0',
                  fontSize: '0.95rem',
                  color: '#c9a227',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                {author.title}
              </p>
            )}

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#e5e9f0', margin: '16px 0' }} />

            {/* Bio */}
            {author.bio && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: '#4b5568',
                  }}
                >
                  {author.bio}
                </p>
              </div>
            )}

            {/* Contact Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    backgroundColor: '#f7f9fc',
                    color: '#4b5568',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid #e5e9f0',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#efe5d8';
                    e.currentTarget.style.borderColor = '#c9a227';
                    e.currentTarget.style.color = '#c9a227';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#f7f9fc';
                    e.currentTarget.style.borderColor = '#e5e9f0';
                    e.currentTarget.style.color = '#4b5568';
                  }}
                >
                  <Mail size={16} />
                  <span>{author.email}</span>
                </a>
              )}

              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    backgroundColor: '#f7f9fc',
                    color: '#4b5568',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    border: '1px solid #e5e9f0',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = '#efe5d8';
                    e.currentTarget.style.borderColor = '#c9a227';
                    e.currentTarget.style.color = '#c9a227';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#f7f9fc';
                    e.currentTarget.style.borderColor = '#e5e9f0';
                    e.currentTarget.style.color = '#4b5568';
                  }}
                >
                  <Globe size={16} />
                  <span>Visit Website</span>
                </a>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginTop: 24,
                borderRadius: 8,
                border: '1px solid #e5e9f0',
                backgroundColor: '#f7f9fc',
                color: '#4b5568',
                fontWeight: 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#efe5d8';
                e.currentTarget.style.borderColor = '#c9a227';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#f7f9fc';
                e.currentTarget.style.borderColor = '#e5e9f0';
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
