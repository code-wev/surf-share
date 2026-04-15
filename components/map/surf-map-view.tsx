"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, ZoomControl } from "react-leaflet";

import type { SurfSpot } from "@/components/map/map-demo-data";

type SurfMapViewProps = {
  spots: SurfSpot[];
  activeSpotId: string | null;
  onActiveSpotChange: (spotId: string) => void;
};

const defaultCenter: [number, number] = [-25.2744, 133.7751];
const defaultZoom = 4;

function createSpotMarkerIcon(isActive: boolean) {
  return L.divIcon({
    className: "surf-map-pin-icon",
    html: `<span class="surf-map-pin${isActive ? " is-active" : ""}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [14, 28],
  });
}

function FitToSpots({ spots }: { spots: SurfSpot[] }) {
  const map = useMap();

  useEffect(() => {
    if (spots.length === 0) {
      map.setView(defaultCenter, defaultZoom);
      return;
    }

    const { x, y } = map.getSize();
    const horizontalPadding = Math.min(140, Math.max(24, Math.round(x * 0.13)));
    const verticalPadding = Math.min(130, Math.max(24, Math.round(y * 0.16)));

    const bounds = L.latLngBounds(spots.map((spot) => spot.coordinates));
    map.fitBounds(bounds, {
      padding: [verticalPadding, horizontalPadding],
      maxZoom: x < 640 ? 7 : 9,
    });
  }, [map, spots]);

  return null;
}

export default function SurfMapView({ spots, activeSpotId, onActiveSpotChange }: SurfMapViewProps) {
  const inactivePinIcon = useMemo(() => createSpotMarkerIcon(false), []);
  const activePinIcon = useMemo(() => createSpotMarkerIcon(true), []);

  return (
    <div className="surf-map h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full"
        dragging
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains={["a", "b", "c", "d"]}
        />

        <ZoomControl position="bottomright" />
        <FitToSpots spots={spots} />

        {spots.map((spot) => {
          const isActive = spot.id === activeSpotId;

          return (
            <Marker
              key={spot.id}
              position={spot.coordinates}
              icon={isActive ? activePinIcon : inactivePinIcon}
              eventHandlers={{
                click: () => onActiveSpotChange(spot.id),
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
