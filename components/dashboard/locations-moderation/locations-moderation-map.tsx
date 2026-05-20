"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, ZoomControl, useMap, Popup } from "react-leaflet";

import type { LocationModerationItem } from "@/components/dashboard/locations-moderation/locations-moderation-types";
import LocationsModerationFeaturedCard from "./locations-moderation-featured-card";

type LocationsModerationMapProps = {
  locations: LocationModerationItem[];
  activeLocationId: string | null;
  onActiveLocationChange: (locationId: string) => void;
  onViewGallery: () => void;
};

const defaultCenter: [number, number] = [-25.2744, 133.7751];
const defaultZoom = 4;

function createMarkerIcon(isActive: boolean) {
  return L.divIcon({
    className: "surf-map-pin-icon",
    html: `<span class="surf-map-pin${isActive ? " is-active" : ""}"></span>`,
    iconSize: [30, 30],
    iconAnchor: [14, 28],
  });
}

function FitToLocations({ locations }: { locations: LocationModerationItem[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) {
      map.setView(defaultCenter, defaultZoom);
      return;
    }

    const { x, y } = map.getSize();
    const horizontalPadding = Math.min(150, Math.max(24, Math.round(x * 0.12)));
    const verticalPadding = Math.min(130, Math.max(24, Math.round(y * 0.14)));

    const bounds = L.latLngBounds(locations.map((location) => location.coordinates));
    map.fitBounds(bounds, {
      padding: [verticalPadding, horizontalPadding],
      maxZoom: x < 640 ? 6 : 8,
    });
  }, [locations, map]);

  return null;
}

// Fixed offset identical to surf-map-view.tsx
function getActiveLocationOffset() {
  return L.point(0, 160);
}

function KeepActiveLocationVisible({
  activeLocation,
}: {
  activeLocation: LocationModerationItem | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeLocation) {
      return;
    }

    const panIntoView = () => {
      const offset = getActiveLocationOffset();

      if (offset.x === 0 && offset.y === 0) {
        return;
      }

      const projectedPoint = map.project(activeLocation.coordinates, map.getZoom());
      const adjustedCenterPoint = projectedPoint.subtract(offset);
      const adjustedCenter = map.unproject(adjustedCenterPoint, map.getZoom());

      map.panTo(adjustedCenter, {
        animate: true,
        duration: 0.3,
      });
    };

    panIntoView();
    map.on("resize", panIntoView);

    return () => {
      map.off("resize", panIntoView);
    };
  }, [activeLocation, map]);

  return null;
}

function ActiveMarker({
  location,
  icon,
  onClick,
  onViewGallery,
}: {
  location: LocationModerationItem;
  icon: L.DivIcon;
  onClick: () => void;
  onViewGallery: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [location.id]);

  return (
    <Marker
      ref={markerRef}
      key={`active-${location.id}`}
      position={location.coordinates}
      icon={icon}
      zIndexOffset={600}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup
        autoPan={false}
        closeButton={false}
        className="custom-map-popup"
        offset={[0, -12]}
      >
        <LocationsModerationFeaturedCard location={location} onViewGallery={onViewGallery} />
      </Popup>
    </Marker>
  );
}

export default function LocationsModerationMap({
  locations,
  activeLocationId,
  onActiveLocationChange,
  onViewGallery,
}: LocationsModerationMapProps) {
  const activeLocation = useMemo(
    () => locations.find((location) => location.id === activeLocationId) ?? null,
    [locations, activeLocationId],
  );

  const inactiveLocations = useMemo(
    () => locations.filter((location) => location.id !== activeLocationId),
    [locations, activeLocationId],
  );

  const inactivePinIcon = useMemo(() => createMarkerIcon(false), []);
  const activePinIcon = useMemo(() => createMarkerIcon(true), []);

  return (
    <div className="surf-map h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
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
        <FitToLocations locations={locations} />
        <KeepActiveLocationVisible activeLocation={activeLocation} />

        <Pane name="inactive-location-pins" style={{ zIndex: 560 }}>
          {inactiveLocations.map((location) => (
            <Marker
              key={location.id}
              position={location.coordinates}
              icon={inactivePinIcon}
              eventHandlers={{
                click: () => onActiveLocationChange(location.id),
              }}
            />
          ))}
        </Pane>

        {activeLocation ? (
          <Pane name="active-location-pin" style={{ zIndex: 710 }}>
            <ActiveMarker
              location={activeLocation}
              icon={activePinIcon}
              onClick={() => onActiveLocationChange(activeLocation.id)}
              onViewGallery={onViewGallery}
            />
          </Pane>
        ) : null}
      </MapContainer>
    </div>
  );
}