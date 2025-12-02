"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './InfoPopup.module.css';

type InfoPopupProps = {
  imageSrc?: string;
  width?: number;
  height?: number;
  cookieKey?: string;
  maxAgeSeconds?: number; // default 1 year
};

const InfoPopup = ({
  imageSrc = "https://ewyyikh0ws.ufs.sh/f/dpcit5LWLcSxTX6xYiSxDYAWdOfao1ME3ClV0yewPzjrIQum",
  width = 500,
  height = 300,
  cookieKey = 'infoPopupShown',
  maxAgeSeconds = 60 * 60 * 24 * 365,
}: InfoPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

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
        <Image src={imageSrc} alt="Info" width={width} height={height} unoptimized style={{ display: 'block', width: '100%', height: 'auto' }} />
      </div>
    </div>
  );
};

export default InfoPopup;
