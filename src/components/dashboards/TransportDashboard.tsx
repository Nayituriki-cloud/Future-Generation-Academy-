import React, { useState } from 'react';
import { useSchoolStore } from '../../data/store';
import {
  Bus,
  MapPin,
  Users,
  Phone,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';

export const TransportDashboard: React.FC = () => {
  const { state } = useSchoolStore();
  const [selectedRouteId, setSelectedRouteId] = useState<string>(state.routes[0]?.id || '');

  const activeRoute = state.routes.find((r) => r.id === selectedRouteId) || state.routes[0];
  const assignedBus = state.buses.find((b) => b.plateNumber === activeRoute?.busPlate) || state.buses[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold">
              Kigali Transport Logistics & Fleet
            </span>
            <span className="text-xs text-slate-400">· Future Generation Academy</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">School Bus Fleet & Live GPS Radar</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time transit monitoring across Gasabo, Kicukiro, and Nyarugenge districts with automated parent SMS notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-bold">3 FLEET UNITS ONLINE</span>
        </div>
      </div>

      {/* Fleet Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {state.buses.map((bus) => (
          <div
            key={bus.id}
            className={`p-4 rounded-xl border transition-all ${
              bus.status === 'in_transit'
                ? 'bg-slate-900 border-sky-500/40 shadow-sm shadow-sky-500/5'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{bus.plateNumber}</span>
                  <span className="text-[11px] text-slate-400">{bus.model}</span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  bus.status === 'in_transit'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {bus.status.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Current Stop:</span>
                <span className="font-semibold truncate max-w-[170px]">{bus.currentStop}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Driver:</span>
                <span>{bus.driverName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Contact:</span>
                <span className="font-mono text-amber-400">{bus.driverPhone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Current Speed:</span>
                <span className="font-mono font-bold text-emerald-400">{bus.currentSpeed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routes & Waypoints Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-orange-400" />
          <span>Kigali Designated Transit Routes</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {state.routes.map((rt) => (
            <button
              key={rt.id}
              onClick={() => setSelectedRouteId(rt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRouteId === rt.id
                  ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/20 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-xs font-bold block text-white">{rt.name}</span>
              <span className="text-[11px] text-amber-400 block mt-0.5">
                Assigned Bus: {rt.busPlate} · {rt.registeredStudentsCount} Registered Students
              </span>
              <span className="text-[10px] text-slate-500 mt-2 block">
                {rt.startPoint} ➔ {rt.destination}
              </span>
            </button>
          ))}
        </div>

        {activeRoute && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white block">
              Scheduled Pick-Up Waypoints for {activeRoute.name}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              {activeRoute.stops.map((stop, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-[11px] font-medium text-slate-200 truncate">{stop}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
