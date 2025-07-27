'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Typography } from '@mui/material';
import content from "@/data/texts.json"

// Icône rouge personnalisée (comme Google Maps)
const redIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CarteLeaflet() {
  const position = { lat: 16.295293, lng: -61.667341 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center', marginTop: "10rem" }}>
      <Typography
        data-aos="fade-down"
        data-aos-delay="300"
        variant="h2"
        fontFamily={"Rubik, sans-serif"}
        fontWeight={600}
        color="#DB7C26"
        component="h2"
        gutterBottom
      >
        NOTRE ADRESSE
      </Typography>

      <MapContainer
        center={position}
        zoom={16}
        maxZoom={19}
        scrollWheelZoom={false}
        style={{
          width: '80%',
          height: '500px',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
          marginTop: '4rem',
          marginBottom: '4rem',
        }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="Plan (OSM)">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* ✅ Satellite activé par défaut */}
          <LayersControl.BaseLayer checked name="Satellite (Esri)">
            <TileLayer
              attribution='Tiles &copy; Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
              maxNativeZoom={17}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* ✅ Marqueur rouge + popup avec image */}
        <Marker position={position} icon={redIcon}>
          <Popup maxWidth={250}>
            <strong>10 ZAC DE NOLIVIER, Sainte-Rose 97115, Guadeloupe</strong>
            <br />
            Venez nous voir !
            <br />
            <img
              alt="Noliparc"
              src={content.header["image-ext"]}
              style={{ width: '100%', marginTop: '0.5rem', borderRadius: '8px' }}
            />
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
