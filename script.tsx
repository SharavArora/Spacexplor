import React, { useState, useEffect } from 'react';
import { Satellite, Globe, Rocket, Radio, Database, Users, Activity, Zap } from 'lucide-react';

export default function SpaceExplorerApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeView, setActiveView] = useState('satellites');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [trackedSatellite, setTrackedSatellite] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [connectedCompanies, setConnectedCompanies] = useState(new Set());
  const [notifications, setNotifications] = useState([]);

  const [satellites, setSatellites] = useState([
    { id: 'SAT-001', name: 'Starlink-4829', company: 'SpaceX', altitude: 550, speed: 27500, status: 'active', lat: 42.3, lng: -71.1 },
    { id: 'SAT-002', name: 'OneWeb-0445', company: 'OneWeb', altitude: 1200, speed: 26800, status: 'active', lat: 51.5, lng: 0.1 },
    { id: 'SAT-003', name: 'Kuiper-0123', company: 'Amazon', altitude: 630, speed: 27200, status: 'maintenance', lat: 37.7, lng: -122.4 },
    { id: 'SAT-004', name: 'GPS-IIIF-05', company: 'Lockheed Martin', altitude: 20200, speed: 14000, status: 'active', lat: 0, lng: 0 },
    { id: 'SAT-005', name: 'Sentinel-2C', company: 'ESA', altitude: 786, speed: 26900, status: 'active', lat: 48.8, lng: 2.3 },
  ]);

  const spaceCompanies = [
    { 
      id: 'spacex', 
      name: 'SpaceX', 
      satellites: 4829, 
      missions: 89, 
      status: 'operational',
      nextLaunch: '2025-09-23T10:30:00Z',
      connection: 'direct'
    },
    { 
      id: 'oneweb', 
      name: 'OneWeb', 
      satellites: 648, 
      missions: 21, 
      status: 'operational',
      nextLaunch: '2025-09-25T14:15:00Z',
      connection: 'satellite-relay'
    },
    { 
      id: 'amazon', 
      name: 'Amazon Kuiper', 
      satellites: 3236, 
      missions: 15, 
      status: 'expanding',
      nextLaunch: '2025-09-28T08:45:00Z',
      connection: 'direct'
    },
    { 
      id: 'lockheed', 
      name: 'Lockheed Martin', 
      satellites: 24, 
      missions: 156, 
      status: 'operational',
      nextLaunch: '2025-10-02T16:20:00Z',
      connection: 'ground-station'
    },
    { 
      id: 'esa', 
      name: 'European Space Agency', 
      satellites: 89, 
      missions: 78, 
      status: 'operational',
      nextLaunch: '2025-10-05T12:00:00Z',
      connection: 'international-link'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      setSatellites(prev => prev.map(sat => ({
        ...sat,
        lat: sat.lat + (Math.random() - 0.5) * 0.1,
        lng: sat.lng + (Math.random() - 0.5) * 0.1,
        altitude: sat.altitude + (Math.random() - 0.5) * 2,
        speed: sat.speed + (Math.random() - 0.5) * 50
      })));

      const statuses = ['connected', 'syncing', 'updating'];
      setConnectionStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': 
      case 'operational': 
        return 'text-green-400';
      case 'maintenance': 
      case 'expanding': 
        return 'text-yellow-400';
      default: 
        return 'text-red-400';
    }
  };

  const handleTrackSatellite = (satellite) => {
    if (trackedSatellite?.id === satellite.id) {
      setTrackedSatellite(null);
      setIsTracking(false);
      addNotification('Stopped tracking ' + satellite.name, 'info');
    } else {
      setTrackedSatellite(satellite);
      setIsTracking(true);
      addNotification('Now tracking ' + satellite.name + ' from ' + satellite.company, 'success');
    }
  };

  const handleCompanyConnect = (company) => {
    if (connectedCompanies.has(company.id)) {
      setConnectedCompanies(prev => {
        const newSet = new Set(prev);
        newSet.delete(company.id);
        return newSet;
      });
      addNotification('Disconnected from ' + company.name, 'warning');
    } else {
      setConnectedCompanies(prev => new Set([...prev, company.id]));
      addNotification('Successfully connected to ' + company.name, 'success');
    }
  };

  const handleViewCompanyData = (company) => {
    setSelectedCompany(company);
    addNotification('Accessing ' + company.name + ' database...', 'info');
  };

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur border-b border-purple-500/30 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Satellite className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SpaceLink
              </h1>
              <p className="text-sm text-gray-400">Live Space Database Explorer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className={`w-4 h-4 ${connectionStatus === 'connected' ? 'text-green-400' : 'text-yellow-400'} animate-pulse`} />
              <span className="text-sm capitalize">{connectionStatus}</span>
            </div>
            <div className="text-sm text-gray-300">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`px-4 py-3 rounded-lg backdrop-blur border ${
                notification.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-400' :
                notification.type === 'warning' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' :
                'bg-blue-500/20 border-blue-500/30 text-blue-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{notification.message}</span>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="ml-2 text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="bg-black/20 backdrop-blur border-b border-gray-700/50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex space-x-6">
            {[
              { key: 'satellites', label: 'Live Satellites', icon: Satellite },
              { key: 'companies', label: 'Space Companies', icon: Rocket },
              { key: 'connections', label: 'Network Status', icon: Radio }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {activeView === 'satellites' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Live Satellite Tracking</h2>
              <div className="flex items-center space-x-4">
                {isTracking && trackedSatellite && (
                  <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>Tracking: {trackedSatellite.name}</span>
                  </div>
                )}
                <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                  {satellites.length} Satellites Active
                </div>
              </div>
            </div>
            
            {/* Tracked Satellite Details */}
            {isTracking && trackedSatellite && (
              <div className="mb-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur rounded-xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Satellite className="w-8 h-8 mr-3 text-blue-400 animate-pulse" />
                    Now Tracking: {trackedSatellite.name}
                  </h3>
                  <button 
                    onClick={() => {setTrackedSatellite(null); setIsTracking(false);}}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all"
                  >
                    Stop Tracking
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Real-Time Position</p>
                    <p className="text-white font-mono text-lg">{trackedSatellite.lat.toFixed(4)}°N</p>
                    <p className="text-white font-mono text-lg">{trackedSatellite.lng.toFixed(4)}°E</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Orbital Velocity</p>
                    <p className="text-white font-mono text-lg">{trackedSatellite.speed.toFixed(0)} km/h</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Altitude</p>
                    <p className="text-white font-mono text-lg">{trackedSatellite.altitude.toFixed(1)} km</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 mb-2">Signal Strength</p>
                    <p className="text-green-400 text-sm">Excellent</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {satellites.map(sat => (
                <div 
                  key={sat.id} 
                  className={`bg-white/5 backdrop-blur rounded-xl p-6 border transition-all ${
                    trackedSatellite?.id === sat.id 
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20' 
                      : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center">
                        {sat.name}
                        {trackedSatellite?.id === sat.id && (
                          <Activity className="w-4 h-4 ml-2 text-blue-400 animate-pulse" />
                        )}
                      </h3>
                      <p className="text-gray-400">{sat.company}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(sat.status)} bg-current/20`}>
                      {sat.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Altitude</p>
                      <p className="text-white font-mono">{sat.altitude.toFixed(1)} km</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Speed</p>
                      <p className="text-white font-mono">{sat.speed.toFixed(0)} km/h</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Latitude</p>
                      <p className="text-white font-mono">{sat.lat.toFixed(3)}°</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Longitude</p>
                      <p className="text-white font-mono">{sat.lng.toFixed(3)}°</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <button 
                      onClick={() => handleTrackSatellite(sat)}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                        trackedSatellite?.id === sat.id
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      {trackedSatellite?.id === sat.id ? 'Stop Tracking' : 'Track Satellite'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'companies' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Space Companies Network</h2>
              <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {spaceCompanies.length} Companies Available
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {spaceCompanies.map(company => (
                <div 
                  key={company.id} 
                  className={`bg-white/5 backdrop-blur rounded-xl p-6 border transition-all cursor-pointer ${
                    connectedCompanies.has(company.id) 
                      ? 'border-green-500 bg-green-500/10 ring-2 ring-green-500/20' 
                      : selectedCompany?.id === company.id
                      ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20'
                      : 'border-gray-700/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                        <Rocket className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center">
                          {company.name}
                          {connectedCompanies.has(company.id) && (
                            <Zap className="w-4 h-4 ml-2 text-green-400 animate-pulse" />
                          )}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-400 capitalize">{company.connection.replace('-', ' ')}</span>
                          {connectedCompanies.has(company.id) && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Connected</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(company.status)} bg-current/20`}>
                      {company.status}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-400">Satellites</p>
                      <p className="text-2xl font-bold text-white">{company.satellites.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Missions</p>
                      <p className="text-2xl font-bold text-white">{company.missions}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-1">Next Launch</p>
                    <p className="text-white font-mono text-sm">
                      {new Date(company.nextLaunch).toLocaleDateString()} at {new Date(company.nextLaunch).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={(e) => {e.stopPropagation(); handleCompanyConnect(company);}}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        connectedCompanies.has(company.id)
                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                          : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white'
                      }`}
                    >
                      {connectedCompanies.has(company.id) ? 'Disconnect' : 'Connect'}
                    </button>
                    <button 
                      onClick={(e) => {e.stopPropagation(); handleViewCompanyData(company);}}
                      className="flex-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-white text-sm font-medium transition-all"
                    >
                      View Data
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Company Details */}
            {selectedCompany && (
              <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur rounded-xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Database className="w-8 h-8 mr-3 text-purple-400" />
                    {selectedCompany.name} Database Access
                  </h3>
                  <button 
                    onClick={() => setSelectedCompany(null)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Mission Control</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active Missions:</span>
                        <span className="text-white">{selectedCompany.missions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400">94.7%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Fleet Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Satellites:</span>
                        <span className="text-white">{selectedCompany.satellites.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operational:</span>
                        <span className="text-green-400">{Math.floor(selectedCompany.satellites * 0.94).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Communication</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={() => addNotification('Message sent to ' + selectedCompany.name, 'success')}
                        className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-white text-sm transition-all"
                      >
                        Send Message
                      </button>
                      <button 
                        onClick={() => addNotification('Data request sent to ' + selectedCompany.name, 'info')}
                        className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-white text-sm transition-all"
                      >
                        Request Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'connections' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Network Status</h2>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                All Systems Operational
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-blue-400" />
                  Database Sync Status
                </h3>
                
                <div className="space-y-3">
                  {spaceCompanies.map((company) => (
                    <div key={company.id} className="flex items-center justify-between">
                      <span className="text-gray-300">{company.name} Database</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          connectedCompanies.has(company.id) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <span className={`text-sm ${
                          connectedCompanies.has(company.id) ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {connectedCompanies.has(company.id) ? 'Connected' : 'Standby'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <button 
                    onClick={() => {
                      spaceCompanies.forEach(company => {
                        if (!connectedCompanies.has(company.id)) {
                          handleCompanyConnect(company);
                        }
                      });
                    }}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-4 py-2 rounded-lg text-white font-medium transition-all"
                  >
                    Connect All Databases
                  </button>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-purple-400" />
                  Inter-Company Communication
                </h3>
                
                <div className="space-y-3">
                  {[
                    { companies: ['SpaceX', 'OneWeb'], type: 'Data Sharing', status: connectedCompanies.has('spacex') && connectedCompanies.has('oneweb') },
                    { companies: ['Amazon', 'ESA'], type: 'Joint Mission', status: connectedCompanies.has('amazon') && connectedCompanies.has('esa') },
                    { companies: ['All Companies'], type: 'Emergency Protocol', status: connectedCompanies.size === spaceCompanies.length }
                  ].map((link, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">
                        {link.companies.join(' ↔ ')}: {link.type}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Zap className={`w-3 h-3 ${link.status ? 'text-green-400' : 'text-gray-600'}`} />
                        <span className={`text-sm ${link.status ? 'text-green-400' : 'text-gray-600'}`}>
                          {link.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700/50">
                  <button 
                    onClick={() => addNotification('Global communication protocols activated', 'success')}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg text-white font-medium transition-all"
                  >
                    Activate Global Network
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-xl font-bold mb-4 text-center">Real-Time Network Operations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-gray-300">
                <div>
                  <p className="mb-2">📡 Active Connections</p>
                  <p className="text-2xl font-bold text-blue-400">{connectedCompanies.size}/{spaceCompanies.length}</p>
                </div>
                <div>
                  <p className="mb-2">🔗 Data Exchange Rate</p>
                  <p className="text-2xl font-bold text-green-400">{(connectedCompanies.size * 1.2).toFixed(1)} TB/h</p>
                </div>
                <div>
                  <p className="mb-2">🌍 Network Coverage</p>
                  <p className="text-2xl font-bold text-purple-400">{Math.min(98.7 + connectedCompanies.size * 0.2, 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p className="mb-2">⚡ Avg Latency</p>
                  <p className="text-2xl font-bold text-yellow-400">{Math.max(45 - connectedCompanies.size * 5, 15)}ms</p>
                </div>
              </div>

              <div className="mt-6 flex justify-center space-x-4">
                <button 
                  onClick={() => addNotification('Emergency protocols initiated across all networks', 'warning')}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
                >
                  🚨 Emergency Mode
                </button>
                <button 
                  onClick={() => addNotification('Full network diagnostics initiated', 'info')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
                >
                  🔧 Run Diagnostics
                </button>
                <button 
                  onClick={() => addNotification('Network optimization protocols activated', 'success')}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-medium transition-all"
                >
                  ⚡ Optimize Network
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}