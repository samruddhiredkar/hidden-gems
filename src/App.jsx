import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { allPlaces } from './placesData';

// Fix for default Leaflet marker icons not loading in React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  const [city, setCity] = useState('Mumbai');
  const [categoryFilter, setCategoryFilter] = useState('All');
  // Load data into state so we can mutate the 'visits' and 'score' dynamically
  const [places, setPlaces] = useState(allPlaces);

  // The Hidden Score Formula function
  const handleVisit = (id) => {
    setPlaces(places.map(place => {
      if (place.id === id) {
        const newVisits = place.visits + 1;
        // Formula: Base Score - (visits * 5 weight) - budgetPenalty
        const newScore = Math.max(10, place.baseScore - (newVisits * 5) - place.budgetPenalty);
        return { ...place, visits: newVisits, currentScore: newScore };
      }
      return place;
    }));
  };

  if (city !== 'Mumbai') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <select onChange={(e) => setCity(e.target.value)} value={city} className="mb-4 p-2 border rounded shadow">
          <option value="Mumbai">Mumbai (Pilot)</option>
          <option value="Pune">Pune</option>
          <option value="Delhi">Delhi</option>
        </select>
        <h1 className="text-3xl font-bold text-gray-800">Coming Soon to {city}!</h1>
        <p className="text-gray-600 mt-2">Our city-agnostic architecture means we just need to add places and update the map center.</p>
        <button onClick={() => setCity('Mumbai')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Back to Mumbai Pilot</button>
      </div>
    );
  }

  // Filter logic
  const filteredPlaces = places.filter(p => categoryFilter === 'All' || p.category === categoryFilter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header & Filters */}
      <header className="bg-white shadow p-4 flex justify-between items-center z-20">
        <h1 className="text-2xl font-bold text-indigo-600">Hidden Gems</h1>
        <div className="flex gap-4">
          <select onChange={(e) => setCity(e.target.value)} value={city} className="p-2 border rounded">
            <option value="Mumbai">Mumbai (Pilot)</option>
            <option value="Pune">Pune</option>
            <option value="Delhi">Delhi</option>
          </select>
          <select onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter} className="p-2 border rounded">
            <option value="All">All Categories</option>
            <option value="Cheap Eats">Cheap Eats</option>
            <option value="Study Spot">Study Spots</option>
            <option value="Viewpoint">Viewpoints</option>
            <option value="Hidden Spot">Hidden Spots</option>
          </select>
        </div>
      </header>

      {/* Main Content: Map & List */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Side: Cards */}
        <div className="w-full md:w-1/2 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 72px)' }}>
          <div className="grid grid-cols-1 gap-4">
            {filteredPlaces.map(place => {
              const displayScore = place.currentScore || (place.baseScore - place.budgetPenalty);
              const isGettingPopular = displayScore < 50;

              return (
                <div key={place.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col">
                  {place.imageUrl && (
  <img src={place.imageUrl} alt={place.name} className="w-full h-48 object-cover rounded-t-lg mb-4" />
)}
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{place.name}</h2>
                      <p className="text-sm text-gray-500">{place.zone} • {place.category}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full font-bold text-white ${isGettingPopular ? 'bg-red-500' : 'bg-green-500'}`}>
                      Score: {displayScore}
                    </div>
                  </div>
                  
                  <p className="mt-2 text-gray-600 text-sm">{place.shortNote}</p>
                  
                  <div className="mt-3 flex gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {place.budget}
                    </span>
                    {isGettingPopular && (
                      <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        Getting Popular, Try others!
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => handleVisit(place.id)}
                    className="mt-4 w-full bg-indigo-50 flex items-center justify-center py-2 text-indigo-700 font-medium rounded hover:bg-indigo-100 transition"
                  >
                    📍 I Visited This! ({place.visits})
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="w-full md:w-1/2 p-4 h-[50vh] md:h-auto">
          <MapContainer center={[19.0760, 72.8777]} zoom={11} scrollWheelZoom={false}>
            <TileLayer 
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" 
  attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
/>
            {filteredPlaces.map(place => (
              <Marker key={place.id} position={[place.lat, place.lng]}>
                <Popup>
                  <strong>{place.name}</strong><br/>{place.category}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}