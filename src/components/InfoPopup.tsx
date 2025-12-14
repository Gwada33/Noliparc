"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './InfoPopup.module.css';

type InfoPopupProps = {
  imageSrc?: string;
  images?: string[];
  width?: number;
  height?: number;
  cookieKey?: string;
  maxAgeSeconds?: number;
  showAll?: boolean;
};

const InfoPopup = ({
  imageSrc = "https://ewyyikh0ws.ufs.sh/f/dpcit5LWLcSxTX6xYiSxDYAWdOfao1ME3ClV0yewPzjrIQum",
  images,
  width = 500,
  height = 300,
  cookieKey = 'infoPopupShown',
  maxAgeSeconds = 60 * 60 * 24 * 365,
  showAll = false,
}: InfoPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const sources = images && images.length > 0 ? images : [imageSrc];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const popupShown = document.cookie.split('; ').find(row => row.startsWith(`${cookieKey}=`));
    if (!popupShown) {
      setIsOpen(true);
    }
  }, [cookieKey]);

  const handleClose = () => {
    setIsOpen(false);
    document.cookie = `${cookieKey}=true; path=/; max-age=${maxAgeSeconds}`; // Expires after maxAgeSeconds
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.content} style={{ width }}>
        <button className={styles.close} onClick={handleClose} aria-label="Fermer">×</button>
        {showAll && sources.length > 1 ? (
          <div className={styles.gridMulti}>
            {sources.map((src, i) => (
              <Image key={`${src}-${i}`} src={src} alt={`Info ${i+1}`} width={width} height={height} unoptimized style={{ display: 'block', width: '100%', height: 'auto' }} />
            ))}
          </div>
        ) : (
          <Image src={sources[index]} alt="Info" width={width} height={height} unoptimized style={{ display: 'block', width: '100%', height: 'auto' }} />
        )}
        {!showAll && sources.length > 1 && (
          <>
            <button
              className={`${styles.navBtn} ${styles.navLeft}`}
              onClick={() => setIndex((i) => (i - 1 + sources.length) % sources.length)}
              aria-label="Précédent"
            >
              ‹
            </button>
            <button
              className={`${styles.navBtn} ${styles.navRight}`}
              onClick={() => setIndex((i) => (i + 1) % sources.length)}
              aria-label="Suivant"
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoPopup;
