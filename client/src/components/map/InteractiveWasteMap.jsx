import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Badge from '../common/Badge';
import { Trash2, AlertTriangle, Truck } from 'lucide-react';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;

const createCustomIcon = (status, fillLevel) => {
  let color = '#10b981'; // green
  if (fillLevel > 90) color = '#ef4444'; // red
  else if (fillLevel > 75) color = '#f59e0b'; // orange
  else if (fillLevel > 50) color = '#3b82f6'; // blue

  const svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26C32 7.163 24.837 0 16 0z" fill="${color}" stroke="#0f172a" stroke-width="2"/>
      <circle cx="16" cy="16" r="10" fill="#0f172a"/>
      <text x="16" y="20" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle">${fillLevel}%</text>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svgMarker,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38]
  });
};

const InteractiveWasteMap = ({ bins = [], onScheduleCollection, height = '450px' }) => {
  // Center map around Bangalore/India coordinates
  const defaultCenter = [12.9716, 77.5946];

  return (
    <div style={{ height }} className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      <MapContainer 
        center={defaultCenter} 
        zoom={11} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bins.map((bin) => {
          if (!bin.latitude || !bin.longitude) return null;
          return (
            <Marker
              key={bin._id || bin.binId}
              position={[bin.latitude, bin.longitude]}
              icon={createCustomIcon(bin.status, bin.fillLevel)}
            >
              <Popup className="custom-map-popup">
                <div className="p-2 min-w-[200px] text-slate-900">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                    <span className="font-bold text-xs text-slate-900">{bin.binId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      bin.fillLevel > 90 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {bin.fillLevel}% Fill
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{bin.name}</h4>
                  <p className="text-xs text-slate-600 mt-1">{bin.location} ({bin.zone})</p>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>Category: <strong className="text-slate-800">{bin.wasteCategory}</strong></span>
                    <span>Type: <strong className="text-slate-800">{bin.binType}</strong></span>
                  </div>

                  {onScheduleCollection && (
                    <button
                      onClick={() => onScheduleCollection(bin)}
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5" /> Dispatch Collection
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default InteractiveWasteMap;
