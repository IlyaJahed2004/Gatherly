import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
}

// Leaflet's click event only fires on the map instance, which react-leaflet
// only gives access to from inside the MapContainer via this hook.
const ClickHandler = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPickerMap = ({ latitude, longitude, onChange }: LocationPickerMapProps) => {
  const hasPosition = latitude !== 0 || longitude !== 0;
  const center: [number, number] = hasPosition ? [latitude, longitude] : [51.505, -0.09];

  return (
    <MapContainer
      center={center}
      zoom={hasPosition ? 14 : 11}
      scrollWheelZoom={false}
      style={{ height: '260px', width: '100%', borderRadius: '16px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onChange={onChange} />
      {hasPosition && <Marker position={[latitude, longitude]} icon={defaultIcon} />}
    </MapContainer>
  );
};

export default LocationPickerMap;
