"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";

type AddLocationMapPickerProps = {
  coordinates: [number, number];
  onCoordinatesChange: (coordinates: [number, number]) => void;
};

const australiaBounds = L.latLngBounds(
  L.latLng(-44.0, 112.0),
  L.latLng(-9.0, 154.0)
);

function createMarkerIcon() {
  return L.divIcon({
    className: "surf-map-pin-icon",
    html: '<span class="surf-map-pin is-active"></span>',
    iconSize: [30, 30],
    iconAnchor: [14, 28],
  });
}

function CenterOnCoordinates({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.panTo(coordinates, { animate: true, duration: 0.25 });
  }, [coordinates, map]);

  return null;
}

function InteractiveMarker({
  coordinates,
  onCoordinatesChange,
  icon,
}: {
  coordinates: [number, number];
  onCoordinatesChange: (coordinates: [number, number]) => void;
  icon: L.DivIcon;
}) {
  const markerRef = useRef<L.Marker | null>(null);

  useMapEvents({
    click: (event) => {
      onCoordinatesChange([event.latlng.lat, event.latlng.lng]);
    },
  });

  return (
    <Marker
      position={coordinates}
      icon={icon}
      draggable
      ref={markerRef}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;

          if (!marker) {
            return;
          }

          const position = marker.getLatLng();
          onCoordinatesChange([position.lat, position.lng]);
        },
      }}
    />
  );
}

export default function AddLocationMapPicker({
  coordinates,
  onCoordinatesChange,
}: AddLocationMapPickerProps) {
  const markerIcon = useMemo(() => createMarkerIcon(), []);

  return (
    <div className="surf-map h-full w-full">
      <MapContainer
        center={coordinates}
        zoom={5}
        minZoom={4}
        maxBounds={australiaBounds}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
        dragging
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />

        <ZoomControl position="bottomright" />
        <CenterOnCoordinates coordinates={coordinates} />

        <InteractiveMarker
          coordinates={coordinates}
          onCoordinatesChange={onCoordinatesChange}
          icon={markerIcon}
        />
      </MapContainer>
    </div>
  );
}
