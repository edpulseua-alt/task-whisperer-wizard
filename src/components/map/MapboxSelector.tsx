import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapboxSelectorProps {
  token?: string;
  onChange?: (coords: { lng: number; lat: number } | null, address?: string) => void;
}

const MapboxSelector: React.FC<MapboxSelectorProps> = ({ token, onChange }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [internalToken, setInternalToken] = useState<string>(token || "");

  useEffect(() => {
    if (!mapContainer.current || !internalToken) return;

    mapboxgl.accessToken = internalToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.985664, 40.748514],
      zoom: 10,
      pitch: 0,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    const handleClick = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      const { lng, lat } = e.lngLat;
      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
      onChange?.({ lng, lat });
    };

    mapRef.current.on("click", handleClick);

    return () => {
      mapRef.current?.off("click", handleClick);
      mapRef.current?.remove();
    };
  }, [internalToken, onChange]);

  return (
    <div className="space-y-2">
      {!token && (
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="Enter Mapbox public token to enable the map"
            value={internalToken}
            onChange={(e) => setInternalToken(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            aria-label="Mapbox token"
          />
        </div>
      )}
      <div ref={mapContainer} className="h-64 w-full rounded-md border" />
    </div>
  );
};

export default MapboxSelector;
