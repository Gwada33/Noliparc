"use client";
import { useEffect, useMemo, useState } from "react";

export default function GlobalBanner() {
  const [shouldRender, setShouldRender] = useState(false);
  const [banner, setBanner] = useState<any>(null);

  const dismissalKey = useMemo(() => {
    const version = banner?.version ? String(banner.version) : "1";
    return `globalBannerDismissed:${version}`;
  }, [banner?.version]);

  const todayKey = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then((data) => {
        setBanner(data?.announcementBanner ?? null);
      })
      .catch(() => {
        setBanner(null);
      });
  }, []);

  useEffect(() => {
    if (!banner || banner.enabled !== true) {
      setShouldRender(false);
      return;
    }

    const now = Date.now();
    const displayMode = banner.displayMode;
    const startAt = banner.startAt ? Date.parse(String(banner.startAt)) : NaN;
    const endAt = banner.endAt ? Date.parse(String(banner.endAt)) : NaN;

    const inWindow =
      displayMode === 'always'
        ? true
        : (!Number.isNaN(startAt) ? now >= startAt : true) && (!Number.isNaN(endAt) ? now <= endAt : true);

    if (!inWindow) {
      setShouldRender(false);
      return;
    }

    if (banner.dismissible === false) {
      setShouldRender(true);
      return;
    }

    const freq = banner.dismissalFrequency === 'daily' ? 'daily' : 'session';

    try {
      if (freq === 'daily') {
        const dismissedAt = localStorage.getItem(dismissalKey);
        setShouldRender(dismissedAt !== todayKey);
      } else {
        const dismissed = sessionStorage.getItem(dismissalKey);
        setShouldRender(!dismissed);
      }
    } catch {
      setShouldRender(true);
    }
  }, [banner, dismissalKey, todayKey]);

  const handleClose = () => {
    const freq = banner?.dismissalFrequency === 'daily' ? 'daily' : 'session';
    try {
      if (freq === 'daily') {
        localStorage.setItem(dismissalKey, todayKey);
      } else {
        sessionStorage.setItem(dismissalKey, "1");
      }
    } catch {}
    setShouldRender(false);
  };

  if (!shouldRender) return null;

  const contentType = banner?.contentType;
  const imageUrl = banner?.imageUrl ? String(banner.imageUrl) : "";
  const text = banner?.text ? String(banner.text) : "";

  if (contentType === 'text' && !text.trim()) return null;
  if (contentType !== 'text' && !imageUrl.trim()) return null;

  return (
    <div
      role="dialog"
      aria-label="Annonce"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: 900,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 16,
          background: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          padding: 12,
        }}
      >
        {contentType === 'text' ? (
          <div
            style={{
              padding: 18,
              borderRadius: 12,
              background: '#fff3e0',
              color: '#111',
              fontSize: 20,
              fontWeight: 800,
              textAlign: 'center',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.35,
            }}
          >
            {text}
          </div>
        ) : (
          <img
            src={imageUrl}
            alt="Annonce"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 12 }}
          />
        )}
        {banner?.dismissible !== false && (
          <button
            onClick={handleClose}
            aria-label="Fermer l'annonce"
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 40,
              height: 40,
              border: '1px solid rgba(0,0,0,0.18)',
              background: 'rgba(255,255,255,0.92)',
              color: '#111',
              padding: 0,
              borderRadius: 999,
              cursor: 'pointer',
              fontWeight: 700,
              lineHeight: '40px',
              textAlign: 'center',
              fontSize: 22,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

