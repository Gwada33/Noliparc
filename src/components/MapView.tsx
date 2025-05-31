'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

export default function CarteLeaflet() {
  const position = { lat: 16.295037, lng: -61.667341 };

 return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          width: '80%',
          height: '500px',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
        }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Plan (OSM)">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Satellite (Esri)">
               <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Marker position={position}>
          <Popup>
            Noliparc - Sainte-Rose<br />Venez nous voir !
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
