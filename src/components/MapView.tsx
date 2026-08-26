"use client";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import content from "@/data/texts.json";

// Icône rouge personnalisée (comme Google Maps)
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function CarteLeaflet() {
  const position = { lat: 16.295293, lng: -61.667341 };

  return (
    <section className="map-section" aria-label="Adresse et localisation">
      <h2 data-aos="fade-down">Notre adresse</h2>
      <p className="map-subtitle" data-aos="fade-down" data-aos-delay="100">
        10 ZAC de Nolivier, 97115 Sainte-Rose, Guadeloupe
      </p>

      <div className="map-frame" data-aos="zoom-in" data-aos-delay="200">
        <MapContainer
          center={position}
          zoom={16}
          maxZoom={19}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Plan (OSM)">
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite (Esri)">
              <TileLayer
                attribution="Tiles &copy; Esri"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
                maxNativeZoom={17}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <Marker position={position} icon={redIcon}>
            <Popup maxWidth={250}>
              <strong>Noliparc</strong>
              <br />
              10 ZAC de Nolivier, Sainte-Rose 97115, Guadeloupe
              <br />
              Venez nous voir !
              <br />
              <img
                alt="Façade du parc Noliparc"
                src={content.header["image-ext"]}
                style={{ width: "100%", marginTop: "0.5rem", borderRadius: "8px" }}
              />
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}
