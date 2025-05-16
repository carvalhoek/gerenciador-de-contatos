// ContactMap.jsx
import React, { useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { googleMapsApiKey } from "../keys";

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function ContactMap({ lat, lng }) {
  const center = { lat: lat || 0, lng: lng || 0 };
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current && lat != null && lng != null) {
      const map = mapRef.current;
      const newCenter = { lat, lng };
      map.panTo(newCenter);
      map.setZoom(15);
    }
  }, [isLoaded, lat, lng]);

  if (loadError) return <p>Erro ao carregar o mapa</p>;
  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={(map) => {
        mapRef.current = map;
      }}
    >
      {lat != null && lng != null && <Marker position={{ lat, lng }} />}
    </GoogleMap>
  );
}
