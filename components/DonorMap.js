"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix for default Leaflet icons in Next.js
const customIcon = (color) => new L.DivIcon({
   html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
         </div>`,
   className: "",
   iconSize: [30, 30],
   iconAnchor: [15, 30],
});

// Component to change map view smoothly
function ChangeView({ center }) {
   const map = useMap();
   map.setView(center, 13);
   return null;
}

const DonorMap = ({ donors, selectedDonor }) => {
   const defaultCenter = [23.8103, 90.4125]; // Dhaka

   return (
      <MapContainer
         center={defaultCenter}
         zoom={13}
         style={{ height: "100%", width: "100%" }}
         scrollWheelZoom={true}
      >
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
         />

         {selectedDonor && <ChangeView center={[selectedDonor.lat, selectedDonor.lng]} />}

         {donors.map((donor) => (
            <Marker
               key={donor.id}
               position={[donor.lat, donor.lng]}
               icon={customIcon(donor.available ? "#dc2626" : "#94a3b8")} // Red for available, Gray for not
            >
               <Popup>
                  <div className="p-1 min-w-[150px]">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                           {donor.bloodGroup}
                        </span>
                        <h4 className="font-bold text-sm">{donor.name}</h4>
                     </div>
                     <p className="text-[11px] text-slate-600 flex items-center gap-1 mb-2">
                        <MapPin size={10} /> {donor.area}
                     </p>
                     <Button size="sm" className="w-full h-7 text-xs bg-green-600 hover:bg-green-700">
                        <Phone className="h-3 w-3 mr-1" /> Call Now
                     </Button>
                  </div>
               </Popup>
            </Marker>
         ))}
      </MapContainer>
   );
};

export default DonorMap;