"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Listing {
  id: string;
  title: string | null;
  price: number | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
  state: string | null;
  photos: Array<{ url: string; isCoverPicture: boolean }>;
  averageRating?: number;
  reviewCount?: number;
}

interface ListingsMapProps {
  listings: Listing[];
  onMarkerClick?: (listingId: string) => void;
}

export default function ListingsMap({
  listings,
  onMarkerClick,
}: ListingsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!accessToken) {
      console.error(
        "Mapbox access token not found. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file",
      );
      return;
    }

    mapboxgl.accessToken = accessToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 4,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    const validListings = listings.filter((l) => l.lat && l.lng);

    if (validListings.length === 0) return;

    // Add markers
    validListings.forEach((listing) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.pointerEvents = "auto";
      el.innerHTML = `
        <div class="marker-content" style="
          background: white;
          border: 1px solid #ddd;
          border-radius: 20px;
          padding: 6px 12px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        ">
          $${listing.price}
        </div>
      `;

      const markerContent = el.querySelector(".marker-content") as HTMLElement;

      markerContent.addEventListener("mouseenter", () => {
        markerContent.style.transform = "scale(1.1)";
        markerContent.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
        markerContent.style.zIndex = "1000";
      });

      markerContent.addEventListener("mouseleave", () => {
        markerContent.style.transform = "scale(1)";
        markerContent.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        markerContent.style.zIndex = "auto";
      });

      // Create popup with listing card
      const popupContent = `
        <div style="width: 260px; cursor: pointer;" onclick="window.location.href='/listings/${listing.id}'">
          <div style="position: relative; width: 100%; height: 160px; border-radius: 12px; overflow: hidden; margin-bottom: 8px;">
            <img 
              src="${listing.photos[0]?.url || "/images/placeholder.avif"}" 
              alt="${listing.title || "Listing"}"
              style="width: 100%; height: 100%; object-fit: cover;"
            />
          </div>
          <div style="padding: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 4px;">
              <p style="font-weight: 600; font-size: 14px; color: #222; margin: 0;">
                ${listing.city && listing.state ? `${listing.city}, ${listing.state}` : "Location"}
              </p>
              ${
                listing.reviewCount && listing.averageRating
                  ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-size: 12px;">★</span>
                  <span style="font-size: 12px; font-weight: 500;">${listing.averageRating.toFixed(2)}</span>
                </div>
              `
                  : ""
              }
            </div>
            <p style="font-size: 13px; color: #717171; margin: 0 0 6px 0;">
              ${listing.title || "Listing"}
            </p>
            <div style="display: flex; align-items: baseline; gap: 4px;">
              <p style="font-weight: 600; font-size: 14px; margin: 0;">$${listing.price}</p>
              <p style="font-size: 13px; color: #717171; margin: 0;">night</p>
            </div>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: true,
        maxWidth: "280px",
        className: "listing-popup",
      }).setHTML(popupContent);

      markerContent.addEventListener("click", (e) => {
        e.stopPropagation();
        // Toggle popup
        if (popup.isOpen()) {
          popup.remove();
        } else {
          // Close all other popups
          markers.current.forEach((m) => {
            const existingPopup = m.getPopup();
            if (existingPopup && existingPopup.isOpen()) {
              existingPopup.remove();
            }
          });
          popup.addTo(map.current!);
          popup.setLngLat([listing.lng!, listing.lat!]);
        }
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([listing.lng!, listing.lat!])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to markers
    if (validListings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validListings.forEach((listing) => {
        bounds.extend([listing.lng!, listing.lat!]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [listings, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: "400px" }}
    />
  );
}
