"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, useMap, ZoomControl } from "react-leaflet";

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

function getActiveSpotOffset(width: number) {
  if (width < 768) {
    return L.point(0, 180);
  }

  if (width < 1280) {
    return L.point(165, 40);
  }

  if (width < 1500) {
    return L.point(240, 30);
  }

  return L.point(0, 0);
}

function KeepActiveSpotVisible({ activeSpot }: { activeSpot: SurfSpot | null }) {
  const map = useMap();

  useEffect(() => {
    if (!activeSpot) return;

    const alignActiveSpot = () => {
      const { x } = map.getSize();
      const offset = getActiveSpotOffset(x);

      if (offset.x === 0 && offset.y === 0) return;

      const projectedSpotPoint = map.project(activeSpot.coordinates, map.getZoom());
      const adjustedCenterPoint = projectedSpotPoint.subtract(offset);
      const adjustedCenter = map.unproject(adjustedCenterPoint, map.getZoom());

      map.panTo(adjustedCenter, {
        animate: true,
        duration: 0.35,
      });
    };

    alignActiveSpot();
    map.on("resize", alignActiveSpot);

    return () => {
      map.off("resize", alignActiveSpot);
    };
  }, [map, activeSpot]);

  return null;
}

export default function SurfMapView({ spots, activeSpotId, onActiveSpotChange }: SurfMapViewProps) {
  const inactivePinIcon = useMemo(() => createSpotMarkerIcon(false), []);
  const activePinIcon = useMemo(() => createSpotMarkerIcon(true), []);
  const activeSpot = useMemo(
    () => spots.find((spot) => spot.id === activeSpotId) ?? null,
    [spots, activeSpotId],
  );
  const inactiveSpots = useMemo(
    () => spots.filter((spot) => spot.id !== activeSpotId),
    [spots, activeSpotId],
  );

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
        <KeepActiveSpotVisible activeSpot={activeSpot} />

        <Pane name="inactive-pins" style={{ zIndex: 560 }}>
          {inactiveSpots.map((spot) => (
            <Marker
              key={spot.id}
              position={spot.coordinates}
              icon={inactivePinIcon}
              eventHandlers={{
                click: () => onActiveSpotChange(spot.id),
              }}
            />
          ))}
        </Pane>

        {activeSpot ? (
          <Pane name="active-pin" style={{ zIndex: 710 }}>
            <Marker
              position={activeSpot.coordinates}
              icon={activePinIcon}
              zIndexOffset={600}
              eventHandlers={{
                click: () => onActiveSpotChange(activeSpot.id),
              }}
            />
          </Pane>
        ) : null}
      </MapContainer>
    </div>
  );
}
