'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Hospital } from '@/types'
import { Phone, Navigation } from 'lucide-react'

// Fix Leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" fill="#C0392B">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>
  `),
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
})

interface Props { hospitals: Hospital[] }

export default function HospitalMap({ hospitals }: Props) {
  // Center on Bangladesh
  const center: [number, number] = [23.7, 90.4]

  return (
    <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer center={center} zoom={7} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hospitals.map(hospital => (
          <Marker key={hospital.id} position={[hospital.lat, hospital.lng]} icon={redIcon}>
            <Popup className="rounded-xl">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">{hospital.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{hospital.address}</p>
                <div className="flex gap-1 mb-2">
                  {hospital.has_blood_bank && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">🩸 Blood Bank</span>}
                  {hospital.is_24hr && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">24h</span>}
                </div>
                <a href={`tel:${hospital.phone}`} className="flex items-center gap-1 text-xs text-blue-600 hover:underline mb-1">
                  <Phone className="h-3 w-3" /> {hospital.phone}
                </a>
                <a
                  href={`https://maps.google.com/?q=${hospital.lat},${hospital.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Navigation className="h-3 w-3" /> Directions
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
