'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { Maximize2, Play, Sparkles, Video, X } from 'lucide-react';
import './TeamCultureMedia.css';

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
            <div className="worklife-gallery-finish"><Sparkles size={28} /><strong>That&apos;s life at Proowrx</strong><span>Keep scrolling for our videos</span></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function TeamCultureMedia({ initialItems = [] }) {
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(null);
  const [activeVideoId, setActiveVideoId] = useState(null);

  const images = initialItems.filter(item => item.type === 'image');
  const videos = initialItems.filter(item => item.type === 'video');

  useEffect(() => {
    if (!activeImage) return;
    const close = event => event.key === 'Escape' && setActiveImage(null);
    document.addEventListener('keydown', close);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', close);
      document.body.style.overflow = '';
    };
  }, [activeImage]);

  const viewport = { once: true, amount: 0.16 };
  const initial = reduceMotion ? false : 'hidden';

  return (
    <>
      {images.length === 0 ? (
        <section id="worklife-gallery" className="section worklife-gallery-section"><div className="container"><div className="worklife-empty">No photos have been published yet.</div></div></section>
      ) : <ScrollGallery images={images} onSelect={setActiveImage} reduceMotion={reduceMotion} />}

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
                const videoUrl = normalizeMediaUrl(item.url);
                const posterUrl = normalizeMediaUrl(item.posterUrl);
                const isActive = activeVideoId === item._id;
                return (
                  <motion.article
                    key={item._id || index}
                    className="worklife-video-card"
                    variants={cardMotion}
                    whileHover={reduceMotion ? undefined : { y: -10, scale: 1.015 }}
                    layout
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {!isActive ? (
                        <motion.button
                          key="poster"
                          type="button"
                          className="worklife-video-poster"
                          onClick={() => setActiveVideoId(item._id)}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          aria-label={`Play ${item.title}`}
                        >
                          {posterUrl ? <Image src={posterUrl} fill alt="" sizes="(max-width: 900px) 100vw, 50vw" /> : <span className="worklife-video-fallback"><Video size={46} /></span>}
                          <motion.span className="worklife-video-sweep" animate={reduceMotion ? undefined : { x: ['-130%', '160%'] }} transition={{ duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }} />
                          <span className="worklife-video-shade" />
                          <motion.span className="worklife-play" whileHover={reduceMotion ? undefined : { scale: 1.1 }}><Play size={24} fill="currentColor" /></motion.span>
                          <span className="worklife-video-copy"><small>Watch story</small><strong>{item.title}</strong><span>{item.caption}</span></span>
                        </motion.button>
                      ) : (
                        <motion.div key="player" className="worklife-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <video controls autoPlay playsInline preload="metadata" poster={posterUrl}>
                            <source src={videoUrl} type="video/mp4" />
                          </video>
                          <button type="button" className="worklife-video-close" onClick={() => setActiveVideoId(null)} aria-label="Close video"><X size={17} /></button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div className="worklife-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveImage(null)}>
            <motion.figure initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} onClick={event => event.stopPropagation()}>
              <motion.div className="worklife-lightbox-image" layoutId={`worklife-image-${activeImage._id || images.indexOf(activeImage)}`}><Image src={normalizeMediaUrl(activeImage.url)} fill alt={activeImage.title || 'Life at Proowrx'} sizes="95vw" priority /></motion.div>
              {(activeImage.title || activeImage.caption) && <figcaption><strong>{activeImage.title}</strong><span>{activeImage.caption}</span></figcaption>}
              <button type="button" onClick={() => setActiveImage(null)} aria-label="Close image"><X size={20} /></button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
