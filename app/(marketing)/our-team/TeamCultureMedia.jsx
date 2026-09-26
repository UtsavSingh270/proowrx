'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Maximize2, Minus, Play, Plus, RotateCcw, Video, X } from 'lucide-react';
import './TeamCultureMedia.css';

const MIN_IMAGE_ZOOM = 1;
const MAX_IMAGE_ZOOM = 3;
const IMAGE_ZOOM_STEP = 0.25;

function normalizeMediaUrl(url) {
  if (!url) return '';
  if (typeof url === 'object' && typeof url.secure_url === 'string') return url.secure_url;
  if (typeof url === 'string') {
    if (url.startsWith('uploads/')) return `/${url}`;
    return url;
  }
  return '';
}

const sectionMotion = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const gridMotion = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardMotion = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function ScrollGallery({ images, onSelect, reduceMotion }) {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useLayoutEffect(() => {
    const calculate = () => {
      const nextDistance = Math.max(0, (trackRef.current?.scrollWidth || 0) - (viewportRef.current?.clientWidth || 0));
      setDistance(nextDistance);
    };

    calculate();
    const observer = new ResizeObserver(calculate);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [images.length]);

  return (
    <section
      id="worklife-gallery"
      ref={sectionRef}
      className={`worklife-gallery-scroll${distance === 0 ? ' worklife-gallery-scroll--compact' : ''}`}
      style={{ '--worklife-scroll-distance': `${distance}px` }}
    >
      <div className="worklife-gallery-sticky">
        <motion.div className="worklife-section-head worklife-gallery-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionMotion}>
          <span className="chip chip-sky section-eyebrow">Photo Gallery</span>
          <h2 className="section-title">Workplace & Team Gallery </h2>
          <p className="section-body">A look inside our workspaces, team collaborations, and daily office culture.</p>
        </motion.div>
        <div ref={viewportRef} className="worklife-gallery-viewport">
          <motion.div ref={trackRef} className="worklife-gallery-track" style={{ x }}>
            {images.map((item, index) => (
              <motion.button
                type="button"
                key={item._id || index}
                className={`worklife-gallery-item${index % 7 === 3 ? ' worklife-gallery-item--wide' : index % 5 === 0 ? ' worklife-gallery-item--tall' : ''}`}
                initial={reduceMotion ? false : { opacity: 0, y: 35, rotate: index % 2 ? 1.5 : -1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.25) }}
                whileHover={reduceMotion ? undefined : { y: -10, scale: 1.018 }}
                onClick={() => onSelect(item)}
                aria-label={`View ${item.title || 'photo'} in full screen`}
              >
                <motion.span className="worklife-gallery-image" layoutId={`worklife-image-${item._id || index}`}>
                  <Image src={normalizeMediaUrl(item.url)} fill alt={item.title || 'Life at Proowrx'} sizes="(max-width: 700px) 82vw, 46vw" />
                </motion.span>
                <span className="worklife-gallery-shade" />
                {/* <span className="worklife-gallery-index">{String(index + 1).padStart(2, '0')}</span> */}
                <span className="worklife-gallery-copy"><strong>{item.title}</strong><small>{item.caption}</small></span>
                <span className="worklife-expand"><Maximize2 size={16} /></span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function TeamCultureMedia({ initialItems = [] }) {
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [imageZoom, setImageZoom] = useState(MIN_IMAGE_ZOOM);
  const imageViewportRef = useRef(null);
  const previousZoomRef = useRef(MIN_IMAGE_ZOOM);
  const panRef = useRef(null);

  const images = initialItems.filter(item => item.type === 'image');
  const videos = initialItems.filter(item => item.type === 'video');

  const closeImage = () => {
    panRef.current = null;
    previousZoomRef.current = MIN_IMAGE_ZOOM;
    setImageZoom(MIN_IMAGE_ZOOM);
    setActiveImage(null);
  };

  const openImage = item => {
    previousZoomRef.current = MIN_IMAGE_ZOOM;
    setImageZoom(MIN_IMAGE_ZOOM);
    setActiveImage(item);
  };

  const updateImageZoom = nextZoom => {
    setImageZoom(Math.min(MAX_IMAGE_ZOOM, Math.max(MIN_IMAGE_ZOOM, nextZoom)));
  };

  useLayoutEffect(() => {
    if (!activeImage) return;
    const viewport = imageViewportRef.current;
    const previousZoom = previousZoomRef.current;

    if (viewport && previousZoom !== imageZoom) {
      const ratio = imageZoom / previousZoom;
      viewport.scrollLeft = ((viewport.scrollLeft + viewport.clientWidth / 2) * ratio) - viewport.clientWidth / 2;
      viewport.scrollTop = ((viewport.scrollTop + viewport.clientHeight / 2) * ratio) - viewport.clientHeight / 2;
    }

    previousZoomRef.current = imageZoom;
  }, [activeImage, imageZoom]);

  useEffect(() => {
    if (!activeImage && !activeVideo) return;
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        if (activeImage) closeImage();
        if (activeVideo) setActiveVideo(null);
        return;
      }

      if (!activeImage) return;

      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        updateImageZoom(imageZoom + IMAGE_ZOOM_STEP);
      } else if (event.key === '-' || event.key === '_') {
        event.preventDefault();
        updateImageZoom(imageZoom - IMAGE_ZOOM_STEP);
      } else if (event.key === '0') {
        event.preventDefault();
        updateImageZoom(MIN_IMAGE_ZOOM);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImage, activeVideo, imageZoom]);

  const startImagePan = event => {
    if (imageZoom === MIN_IMAGE_ZOOM || event.button !== 0) return;
    const viewport = imageViewportRef.current;
    if (!viewport) return;

    panRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-panning');
  };

  const moveImagePan = event => {
    const viewport = imageViewportRef.current;
    const pan = panRef.current;
    if (!viewport || !pan || pan.pointerId !== event.pointerId) return;

    viewport.scrollLeft = pan.scrollLeft - (event.clientX - pan.x);
    viewport.scrollTop = pan.scrollTop - (event.clientY - pan.y);
  };

  const endImagePan = event => {
    const viewport = imageViewportRef.current;
    if (!viewport || panRef.current?.pointerId !== event.pointerId) return;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    viewport.classList.remove('is-panning');
    panRef.current = null;
  };

  const viewport = { once: true, amount: 0.16 };
  const initial = reduceMotion ? false : 'hidden';

  return (
    <>
      {images.length === 0 ? (
        <section id="worklife-gallery" className="section worklife-gallery-section"><div className="container"><div className="worklife-empty">No photos have been published yet.</div></div></section>
      ) : <ScrollGallery images={images} onSelect={openImage} reduceMotion={reduceMotion} />}

      <section className="section worklife-video-section">
        <div className="container">
          <motion.div className="worklife-section-head" initial={initial} whileInView="visible" viewport={viewport} variants={sectionMotion}>
            <span className="chip chip-violet section-eyebrow">Culture in Motion</span>
            <h2 className="section-title">The Team Experience</h2>
            <p className="section-body">Watch how our teams collaborate, solve operational challenges, and deliver for clients. </p>
          </motion.div>

          {videos.length === 0 ? <div className="worklife-empty">No videos are currently available.</div> : (
            <motion.div className="worklife-video-grid" initial={initial} whileInView="visible" viewport={viewport} variants={gridMotion}>
              {videos.map((item, index) => {
                const posterUrl = normalizeMediaUrl(item.posterUrl);
                return (
                  <motion.article
                    key={item._id || index}
                    className="worklife-video-card"
                    variants={cardMotion}
                    whileHover={reduceMotion ? undefined : { y: -10, scale: 1.015 }}
                    layout
                  >
                    <button
                      type="button"
                      className="worklife-video-poster"
                      onClick={() => setActiveVideo(item)}
                      aria-label={`Play ${item.title || 'team video'} in full screen`}
                    >
                      {posterUrl ? <Image src={posterUrl} fill alt="" sizes="(max-width: 900px) 100vw, 50vw" /> : <span className="worklife-video-fallback"><Video size={46} /></span>}
                      <motion.span className="worklife-video-sweep" animate={reduceMotion ? undefined : { x: ['-130%', '160%'] }} transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} />
                      <span className="worklife-video-shade" />
                      <span className="worklife-play"><Play size={24} fill="currentColor" /></span>
                      <span className="worklife-video-copy"><small>Watch story</small><strong>{item.title}</strong><span>{item.caption}</span></span>
                    </button>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div className="worklife-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeImage}>
            <motion.section
              className="worklife-lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="worklife-image-title"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={event => event.stopPropagation()}
            >
              <header className="worklife-viewer-bar">
                <div className="worklife-viewer-label"><span>Team gallery</span><strong id="worklife-image-title">{activeImage.title || 'Life at Proowrx'}</strong></div>
                <div className="worklife-zoom-controls" aria-label="Image zoom controls">
                  <button type="button" onClick={() => updateImageZoom(imageZoom - IMAGE_ZOOM_STEP)} disabled={imageZoom <= MIN_IMAGE_ZOOM} aria-label="Zoom out"><Minus size={18} /></button>
                  <output aria-live="polite" aria-label="Current zoom level">{Math.round(imageZoom * 100)}%</output>
                  <button type="button" onClick={() => updateImageZoom(imageZoom + IMAGE_ZOOM_STEP)} disabled={imageZoom >= MAX_IMAGE_ZOOM} aria-label="Zoom in"><Plus size={18} /></button>
                  <button type="button" onClick={() => updateImageZoom(MIN_IMAGE_ZOOM)} disabled={imageZoom === MIN_IMAGE_ZOOM} aria-label="Reset image zoom"><RotateCcw size={17} /></button>
                </div>
                <button type="button" className="worklife-viewer-close" onClick={closeImage} aria-label="Close image viewer"><X size={20} /></button>
              </header>

              <div
                ref={imageViewportRef}
                className={`worklife-lightbox-viewport${imageZoom > MIN_IMAGE_ZOOM ? ' is-zoomed' : ''}`}
                onPointerDown={startImagePan}
                onPointerMove={moveImagePan}
                onPointerUp={endImagePan}
                onPointerCancel={endImagePan}
                onDoubleClick={() => updateImageZoom(imageZoom === MIN_IMAGE_ZOOM ? 2 : MIN_IMAGE_ZOOM)}
              >
                <motion.div
                  className="worklife-lightbox-image"
                  layoutId={`worklife-image-${activeImage._id || images.indexOf(activeImage)}`}
                  style={{ width: `${imageZoom * 100}%`, height: `${imageZoom * 100}%` }}
                >
                  <Image src={normalizeMediaUrl(activeImage.url)} fill alt={activeImage.title || 'Life at Proowrx'} sizes="100vw" priority draggable={false} />
                </motion.div>
              </div>

              <footer className="worklife-viewer-caption">
                <span>{activeImage.caption || 'A moment from life at Proowrx.'}</span>
                <small>{imageZoom > MIN_IMAGE_ZOOM ? 'Drag or scroll to explore the image' : 'Double-click to zoom · +/− keys also work'}</small>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeVideo && (
          <motion.div className="worklife-video-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveVideo(null)}>
            <motion.section
              className="worklife-video-modal-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="worklife-video-title"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={event => event.stopPropagation()}
            >
              <header className="worklife-video-modal-bar">
                <div><span className="worklife-video-live"><i /> Culture story</span><strong id="worklife-video-title">{activeVideo.title || 'The Team Experience'}</strong></div>
                <button type="button" onClick={() => setActiveVideo(null)} aria-label="Close video viewer"><X size={20} /></button>
              </header>
              <div className="worklife-video-stage">
                <video controls autoPlay playsInline preload="metadata" poster={normalizeMediaUrl(activeVideo.posterUrl)}>
                  <source src={normalizeMediaUrl(activeVideo.url)} type="video/mp4" />
                </video>
              </div>
              {activeVideo.caption && <footer className="worklife-video-modal-caption">{activeVideo.caption}</footer>}
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
