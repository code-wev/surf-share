"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Pane, TileLayer, useMap, ZoomControl, Popup } from "react-leaflet";
import Image from "next/image";
import { MapPin } from "lucide-react";

import type { SurfSpot } from "@/components/map/map-demo-data";
import Link from "next/link";

type SurfMapViewProps = {
  spots: SurfSpot[];
  activeSpotId: string | null;
  onActiveSpotChange: (spotId: string) => void;
};

const defaultCenter: [number, number] = [-25.2744, 133.7751];
const defaultZoom = 4;

const australiaBounds = L.latLngBounds(L.latLng(-55.0, 95.0), L.latLng(0.0, 165.0));

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getActiveSpotOffset(_width: number) {
  // Return a fixed vertical offset so that the map centers slightly below the pin,
  // keeping the marker and its popup attached perfectly within the visible screen area.
  return L.point(0, 160);
}

function KeepActiveSpotVisible({ activeSpot }: { activeSpot: SurfSpot | null }) {
  const map = useMap();

  useEffect(() => {
    if (!activeSpot) return;

    const alignActiveSpot = () => {
      const { x } = map.getSize();
      const offset = getActiveSpotOffset(x);

      if (offset.x === 0 && offset.y === 0) {
        map.panTo(activeSpot.coordinates, {
          animate: true,
          duration: 0.35,
        });
        return;
      }

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

function ActiveMarker({
  spot,
  icon,
  onClick,
}: {
  spot: SurfSpot;
  icon: L.DivIcon;
  onClick: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      // Small timeout ensures Leaflet has finished attaching the popup
      // to the marker layer before we try to open it programmatically.
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [spot.id]);

  return (
    <Marker
      ref={markerRef}
      key={`active-${spot.id}`}
      position={spot.coordinates}
      icon={icon}
      zIndexOffset={600}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup
        autoPan={false}
        closeButton={false}
        className="custom-map-popup hidden! sm:block!"
        offset={[0, -12]}
      >
        <article className="border-line-weaker bg-surface-muted-100 flex w-70 overflow-hidden rounded-xl border shadow-[0_14px_30px_rgba(15,23,42,0.14)] sm:w-[320px]">
          <div className="relative min-h-25 w-1/3">
            <Image src={spot.imageSrc} alt={spot.name} fill className="object-cover" />
          </div>
          <div className="flex w-2/3 flex-col justify-center p-3">
            <h3 className="text-text-strong line-clamp-1 text-sm leading-tight font-semibold">
              {spot.name}
            </h3>
            <p className="text-text-weak mt-1 flex items-center gap-1 text-[11px]">
              <MapPin size={10} /> {spot.state}, {spot.country}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-text-weak text-[10px] font-medium">{spot.photoCount} Photos</p>
              <Link
                href={`/gallery?locationId=${spot.id}`}
                className="bg-brand-default hover:bg-brand-hover rounded-md px-3 py-1.5 text-[11px] font-semibold text-white transition-colors"
              >
                <h1 className="text-white">View Gallery</h1>
              </Link>
            </div>
          </div>
        </article>
      </Popup>
    </Marker>
  );
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
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
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
            <ActiveMarker
              spot={activeSpot}
              icon={activePinIcon}
              onClick={() => onActiveSpotChange(activeSpot.id)}
            />
          </Pane>
        ) : null}
      </MapContainer>
    </div>
  );
}
