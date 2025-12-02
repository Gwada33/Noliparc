"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaChevronRight } from "react-icons/fa";

const routeLabels: Record<string, string> = {
  "admin": "Tableau de bord",
  "users": "Utilisateurs",
  "schedules": "Horaires",
  "reservations": "Réservations",
  "calendrier": "Calendrier",
  "avent": "Calendrier de l'Avent",
  "emails": "Emails",
  "stats": "Statistiques",
    "events": "Événements",
    "config": "Configuration"
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname.startsWith('/admin')) return null;

  const pathSegments = pathname.split('/').filter(segment => segment !== '');
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      padding: '1rem 2rem', 
      background: '#f8f9fa', 
      borderBottom: '1px solid #e0e0e0',
      fontSize: '0.9rem',
      color: '#666'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none' }}>
        <FaHome />
      </Link>
      
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = routeLabels[segment] || segment;

        return (
          <div key={path} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaChevronRight size={10} />
            {isLast ? (
              <span style={{ fontWeight: '600', color: '#333', textTransform: 'capitalize' }}>
                {label}
              </span>
            ) : (
              <Link href={path} style={{ color: '#666', textDecoration: 'none', textTransform: 'capitalize' }}>
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
