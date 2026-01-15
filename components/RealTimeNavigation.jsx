"use client";
import { Button } from "@/components/ui/button";
import { calculateDistance, getOSMRouteLink } from "@/utils/navigation";
import {
  ExternalLink,
  EyeOff,
  LocateFixed,
  MapPin,
  Navigation,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Load Map with SSR disabled
const DonorMap = dynamic(() => import("@/components/DonorMap"), { ssr: false });

const RealTimeNavigation = ({ patientLocation }) => {
  // patientLocation example: { lat: 23.7509, lng: 90.3935, name: "City Hospital" }

  const [donorLocation, setDonorLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  // Toggle Real-Time Tracking
  const toggleTracking = () => {
    if (isTracking) {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
      setDonorLocation(null);
    } else {
      if ("geolocation" in navigator) {
        setIsTracking(true);
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            setDonorLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => console.error(err),
          { enableHighAccuracy: true },
        );
        setWatchId(id);
      } else {
        alert("Geolocation is not supported by your browser");
      }
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  const distance = calculateDistance(
    donorLocation?.lat,
    donorLocation?.lng,
    patientLocation.lat,
    patientLocation.lng,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Navigation className="text-red-600" />
              Navigation to Patient
            </h2>
            <p className="text-sm text-slate-500">
              Target: {patientLocation.name}
            </p>
          </div>

          <Button
            onClick={toggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="rounded-full px-6"
          >
            {isTracking ? (
              <EyeOff className="mr-2 h-4 w-4" />
            ) : (
              <LocateFixed className="mr-2 h-4 w-4" />
            )}
            {isTracking ? "Stop Tracking" : "Share My Location"}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Stats Card */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-bold uppercase text-slate-400">
                Current Distance
              </p>
              <h3 className="text-4xl font-black text-red-600">
                {distance ? `${distance} KM` : "--"}
              </h3>
            </div>

            <div className="space-y-3 rounded-2xl border p-4">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="text-blue-500" size={18} />
                <span className="font-medium">
                  Destination: {patientLocation.name}
                </span>
              </div>

              {isTracking && donorLocation && (
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() =>
                    window.open(
                      getOSMRouteLink(
                        donorLocation.lat,
                        donorLocation.lng,
                        patientLocation.lat,
                        patientLocation.lng,
                      ),
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open OSM Directions
                </Button>
              )}

              {!isTracking && (
                <p className="text-center text-xs italic text-slate-400">
                  Enable "Share My Location" to get distance and directions.
                </p>
              )}
            </div>
          </div>

          {/* Map Preview */}
          <div className="h-64 overflow-hidden rounded-2xl border md:h-full">
            <DonorMap
              donors={
                isTracking && donorLocation
                  ? [
                      {
                        ...donorLocation,
                        id: "me",
                        name: "Me",
                        available: true,
                        bloodGroup: "You",
                      },
                    ]
                  : []
              }
              selectedDonor={patientLocation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNavigation;
