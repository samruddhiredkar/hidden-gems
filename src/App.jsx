import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { allPlaces } from './placesData'; 

import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function App() {
  const [city, setCity] = useState('Mumbai');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [places, setPlaces] = useState(allPlaces);

  const categories = ['All', 'Cheap Eats', 'Study Spot', 'Viewpoint', 'Hidden Spot'];

  const handleVisit = (id) => {
    setPlaces(places.map(place => {
      if (place.id === id) {
        const newVisits = (place.visits || 0) + 1;
        const newScore = Math.max(10, (place.baseScore || 100) - (newVisits * 5) - (place.budgetPenalty || 0));
        return { ...place, visits: newVisits, currentScore: newScore };
      }
      return place;
    }));
  };

  if (city !== 'Mumbai') {
    return (
      <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-center">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Coming Soon to {city}!</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Our data model is city-agnostic. To launch here, we just need to seed local spots and update the map center.
          </p>
          <button 
            onClick={() => setCity('Mumbai')} 
            className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            Return to Mumbai Pilot
          </button>
        </div>
      </div>
    );
  }

  const filteredPlaces = places.filter(p => categoryFilter === 'All' || p.category === categoryFilter);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col font-sans overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-20 flex-shrink-0">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hidden<span className="text-indigo-600">Gems</span></h1>
        <select 
          onChange={(e) => setCity(e.target.value)} 
          value={city} 
          className="bg-slate-100 border-none text-slate-700 text-sm font-semibold rounded-lg py-2.5 px-4 cursor-pointer"
        >
          <option value="Mumbai">📍 Mumbai (Pilot)</option>
          <option value="Pune">📍 Pune</option>
          <option value="Delhi">📍 Delhi</option>
        </select>
      </header>

      <div className="bg-white shadow-sm z-10 flex-shrink-0 border-b border-slate-100">
        <div className="flex gap-2 overflow-x-auto px-6 py-3 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                categoryFilter === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 flex flex-col-reverse lg:flex-row overflow-hidden relative">
        <section className="w-full lg:w-1/2 xl:w-5/12 h-[60%] lg:h-full overflow-y-auto p-4 lg:p-6 space-y-6 bg-slate-50">
          <div className="grid grid-cols-1 gap-6 pb-20 lg:pb-6">
            {filteredPlaces.map(place => {
              const displayScore = place.currentScore || (place.baseScore - (place.budgetPenalty || 0)) || 85;
              const isGettingPopular = displayScore < 50;
              const isHidden = displayScore >= 75;
              const scoreColor = isHidden ? 'bg-emerald-500' : isGettingPopular ? 'bg-rose-500' : 'bg-amber-500';

              return (
                <div key={place.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col relative">
                  <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                    {place.imageUrl ? (
                      <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">No Image Available</div>
                    )}
                    <div className={`absolute top-4 right-4 ${scoreColor} text-white shadow-lg rounded-2xl px-3 py-2 flex flex-col items-center justify-center`}>
                      <span className="text-xs font-semibold uppercase tracking-wider mb-0.5">Hidden Score</span>
                      <span className="text-2xl font-black leading-none">{displayScore}</span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-2xl font-extrabold text-slate-800 mb-1">{place.name}</h2>
                    <div className="flex items-center text-sm font-medium text-indigo-600 gap-1.5 mb-3">
                      {place.zone || 'Mumbai'} • {place.category}
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm flex-1">{place.shortNote || 'A local gem.'}</p>
                    
                    <div className="mt-5 flex flex-wrap gap-2 items-center">
                      <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                        💸 {place.budget || 'Budget friendly'}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleVisit(place.id)}
                      className="mt-6 w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white py-3.5 font-bold rounded-xl transition-colors"
                    >
                      I Checked In Here! ({place.visits || 0})
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="w-full lg:w-1/2 xl:w-7/12 h-[40%] lg:h-full p-0 lg:p-6 lg:pl-0 z-0 relative">
          <div className="w-full h-full lg:rounded-3xl overflow-hidden shadow-inner border border-slate-200">
            <MapContainer center={[19.0760, 72.8777]} zoom={11} scrollWheelZoom={true} className="w-full h-full z-0">
              <TileLayer 
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}" 
              />
              {filteredPlaces.map(place => (
                <Marker key={`map-${place.id}`} position={[place.lat || 19.0760, place.lng || 72.8777]}>
                  <Popup className="font-sans">
                    <div className="text-center">
                      <strong className="block text-slate-800 text-base mb-1">{place.name}</strong>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md">{place.category}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>
      </main>
    </div>
  );
}
