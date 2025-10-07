// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Wifi, WifiOff, Activity, Droplets, CheckCircle, Loader2, Radio } from 'lucide-react';

// const ConnectDevice = () => {
//   const [deviceId, setDeviceId] = useState('');
//   const [isScanning, setIsScanning] = useState(false);
//   const [isConnected, setIsConnected] = useState(false);
//   const [deviceData, setDeviceData] = useState(null);
//   const [connectionStatus, setConnectionStatus] = useState('disconnected');
//   const [availableDevices, setAvailableDevices] = useState([]);

//   // --- Scan simulation ---
//   const scanForDevices = () => {
//     setIsScanning(true);
//     setConnectionStatus('scanning');
//     setTimeout(() => {
//       const mockDevices = [
//         { id: 'AQ-WQ-001', name: 'AquaSense Pro', signal: 95, battery: 87 },
//         { id: 'AQ-WQ-002', name: 'AquaSense Pro', signal: 78, battery: 92 },
//         { id: 'AQ-WQ-003', name: 'AquaSense Pro', signal: 65, battery: 45 },
//       ];
//       setAvailableDevices(mockDevices);
//       setIsScanning(false);
//       setConnectionStatus('devices_found');
//     }, 2000);
//   };

//   const connectToDevice = (device) => {
//     setConnectionStatus('connecting');
//     setDeviceId(device.id);
//     setTimeout(() => {
//       setIsConnected(true);
//       setConnectionStatus('connected');
//       startDataStream();
//     }, 1500);
//   };

//   // --- Data generator based on BIS IS 10500:2012 ranges ---
//   const startDataStream = () => {
//     const generateReading = () => ({
//       // Basic parameters
//       pH: (6.5 + Math.random() * 2).toFixed(2), // 6.5–8.5
//       EC: (200 + Math.random() * 800).toFixed(0), // µS/cm
//       temperature: (20 + Math.random() * 10).toFixed(1), // °C
//       DO: (4 + Math.random() * 6).toFixed(2), // mg/L

//       // Major ions
//       CO3: (Math.random() * 10).toFixed(2),
//       HCO3: (Math.random() * 400).toFixed(1),
//       Cl: (Math.random() * 250).toFixed(1),
//       F: (Math.random() * 1.0).toFixed(2),
//       SO4: (Math.random() * 200).toFixed(1),
//       NO3: (Math.random() * 45).toFixed(1),
//       PO4: (Math.random() * 0.3).toFixed(2),

//       // Heavy Metals (BIS limits)
//       Pb: (Math.random() * 0.01).toFixed(3), // ≤0.01
//       Cd: (Math.random() * 0.003).toFixed(3), // ≤0.003
//       Cr: (Math.random() * 0.05).toFixed(3), // ≤0.05
//       Ni: (Math.random() * 0.1).toFixed(3), // ≤0.1
//       As: (Math.random() * 0.01).toFixed(3), // ≤0.01
//       Hg: (Math.random() * 0.001).toFixed(4), // ≤0.001
//       Fe: (Math.random() * 0.3).toFixed(3), // ≤0.3
//       Cu: (Math.random() * 1.0).toFixed(2), // ≤1.0
//       Zn: (Math.random() * 5.0).toFixed(2), // ≤5.0
//       Mn: (Math.random() * 0.3).toFixed(2), // ≤0.3
//       Co: (Math.random() * 0.05).toFixed(3), // trace level

//       timestamp: new Date().toLocaleTimeString(),
//     });

//     setDeviceData(generateReading());
//     const interval = setInterval(() => setDeviceData(generateReading()), 5000);
//     return () => clearInterval(interval);
//   };

//   const disconnectDevice = () => {
//     setIsConnected(false);
//     setConnectionStatus('disconnected');
//     setDeviceData(null);
//     setDeviceId('');
//     setAvailableDevices([]);
//   };

//   // --- HPI calculation for heavy metals only ---
//   const calculateHPI = (data) => {
//     if (!data) return 0;
//     const standards = {
//       Pb: 0.01, Cd: 0.003, Cr: 0.05, Ni: 0.1, As: 0.01,
//       Hg: 0.001, Fe: 0.3, Cu: 1.0, Zn: 5.0, Mn: 0.3, Co: 0.05
//     };
//     const weights = {
//       Pb: 0.15, Cd: 0.15, Cr: 0.1, Ni: 0.1, As: 0.15,
//       Hg: 0.15, Fe: 0.05, Cu: 0.05, Zn: 0.05, Mn: 0.03, Co: 0.02
//     };

//     let hpiSum = 0, weightSum = 0;
//     for (const metal in standards) {
//       const mi = parseFloat(data[metal]);
//       const si = standards[metal];
//       const qi = (mi / si) * 100;
//       hpiSum += qi * weights[metal];
//       weightSum += weights[metal];
//     }
//     return (hpiSum / weightSum).toFixed(2);
//   };

//   const getHPIStatus = (hpi) => {
//     if (hpi < 25) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
//     if (hpi < 50) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
//     if (hpi < 75) return { text: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50' };
//     return { text: 'Very Poor', color: 'text-red-600', bg: 'bg-red-50' };
//   };

//   const hpiValue = calculateHPI(deviceData);
//   const hpiStatus = getHPIStatus(hpiValue);

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Connect IoT Heavy Metal Detection Device</h1>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* Left Column */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* Connection Status Card */}
//             <Card className="border-2 border-blue-300 shadow-lg">
//               <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Radio className="h-5 w-5" /> Device Connection
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-6">
//                 {connectionStatus === 'disconnected' && (
//                   <div className="text-center">
//                     <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//                     <p className="text-gray-600 mb-6">No device connected</p>
//                     <Button onClick={scanForDevices} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full">
//                       <Wifi className="mr-2" /> Scan for Devices
//                     </Button>
//                   </div>
//                 )}
//                 {connectionStatus === 'scanning' && (
//                   <div className="text-center py-6">
//                     <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin mb-3" />
//                     <p className="text-gray-600">Scanning...</p>
//                   </div>
//                 )}
//                 {connectionStatus === 'devices_found' && (
//                   <div className="space-y-3">
//                     <p className="font-medium mb-3">Available Devices:</p>
//                     {availableDevices.map(d => (
//                       <div key={d.id} onClick={() => connectToDevice(d)} className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition">
//                         <div className="flex justify-between">
//                           <div>
//                             <p className="font-medium">{d.name}</p>
//                             <p className="text-sm text-gray-500">{d.id}</p>
//                           </div>
//                           <p className="text-sm text-gray-500">{d.signal}% • 🔋{d.battery}%</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//                 {connectionStatus === 'connecting' && (
//                   <div className="text-center py-6">
//                     <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin mb-3" />
//                     <p className="text-gray-600">Connecting...</p>
//                   </div>
//                 )}
//                 {connectionStatus === 'connected' && (
//   <div className="text-center space-y-4">
//     <div className="flex items-center justify-center gap-3">
//       <Wifi className="h-6 w-6 text-blue-600 animate-pulse" />
//       <span className="font-medium text-gray-700">Connected to {deviceId}</span>
//     </div>
//     <Alert className="bg-green-50 border-green-200">
//       <CheckCircle className="h-4 w-4 text-green-600" />
//       <AlertDescription className="text-green-800 font-medium">
//         Device is live and streaming data
//       </AlertDescription>
//     </Alert>
//     <Button
//       variant="destructive"
//       onClick={disconnectDevice}
//       className="w-full bg-red-600 hover:bg-black"
//     >
//       Disconnect
//     </Button>
//   </div>
// )}
//  </CardContent>
//             </Card>

//             {/* HPI Card */}
//             {isConnected && deviceData && (
//               <Card className="border-2 shadow-lg">
//                 <CardHeader>
//                   <CardTitle className="text-lg">Heavy Metal Pollution Index (HPI)</CardTitle>
//                 </CardHeader>
//                 <CardContent className="text-center">
//                   <div className={`text-5xl font-bold ${hpiStatus.color}`}>{hpiValue}</div>
//                   <div className={`text-lg font-semibold ${hpiStatus.color}`}>{hpiStatus.text}</div>
//                   <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
//                     <div
//                       className="h-3 rounded-full transition-all duration-500"
//                       style={{
//                         width: `${Math.min(hpiValue, 100)}%`,
//                         backgroundColor:
//                           hpiValue < 25
//                             ? '#16a34a'
//                             : hpiValue < 50
//                             ? '#2563eb'
//                             : hpiValue < 75
//                             ? '#ea580c'
//                             : '#dc2626',
//                       }}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Column - Live Data */}
//           <div className="lg:col-span-2">
//             <Card className="border-2 border-blue-300 shadow-lg h-full">
//               <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Droplets className="h-5 w-5" /> Live Water Quality Parameters
//                 </CardTitle>
//                 <CardDescription className="text-blue-100">
//                   Real-time readings from connected device
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 space-y-6">
//                 {!isConnected ? (
//                   <div className="text-center py-20 text-gray-500">Connect a device to view live data</div>
//                 ) : (
//                   <>
//                     {/* Basic */}
//                     <div>
//                       <h3 className="font-semibold text-lg mb-3 text-blue-900">Basic Parameters</h3>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         {[{ label: 'pH', value: deviceData?.pH, unit: '' },
//                           { label: 'EC', value: deviceData?.EC, unit: 'µS/cm' },
//                           { label: 'Temperature', value: deviceData?.temperature, unit: '°C' },
//                           { label: 'Dissolved Oxygen', value: deviceData?.DO, unit: 'mg/L' }].map(p => (
//                           <div key={p.label} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
//                             <div className="text-sm text-gray-600 mb-1">{p.label}</div>
//                             <div className="text-2xl font-bold text-blue-900">{p.value}</div>
//                             <div className="text-xs text-gray-500">{p.unit}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Major Ions */}
//                     <div>
//                       <h3 className="font-semibold text-lg mb-3 text-blue-900">Major Ions (mg/L)</h3>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                         {[{ label: 'CO₃', value: deviceData?.CO3 },
//                           { label: 'HCO₃', value: deviceData?.HCO3 },
//                           { label: 'Cl', value: deviceData?.Cl },
//                           { label: 'F', value: deviceData?.F },
//                           { label: 'SO₄', value: deviceData?.SO4 },
//                           { label: 'NO₃', value: deviceData?.NO3 },
//                           { label: 'PO₄', value: deviceData?.PO4 }].map(p => (
//                           <div key={p.label} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
//                             <div className="text-xs text-gray-600 mb-1">{p.label}</div>
//                             <div className="text-lg font-semibold text-gray-900">{p.value}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Heavy Metals */}
//                     <div>
//                       <h3 className="font-semibold text-lg mb-3 text-red-900">Heavy Metals (mg/L)</h3>
//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                         {[{ label: 'Lead (Pb)', value: deviceData?.Pb },
//                           { label: 'Cadmium (Cd)', value: deviceData?.Cd },
//                           { label: 'Chromium (Cr)', value: deviceData?.Cr },
//                           { label: 'Nickel (Ni)', value: deviceData?.Ni },
//                           { label: 'Arsenic (As)', value: deviceData?.As },
//                           { label: 'Mercury (Hg)', value: deviceData?.Hg },
//                           { label: 'Iron (Fe)', value: deviceData?.Fe },
//                           { label: 'Copper (Cu)', value: deviceData?.Cu },
//                           { label: 'Zinc (Zn)', value: deviceData?.Zn },
//                           { label: 'Manganese (Mn)', value: deviceData?.Mn },
//                           { label: 'Cobalt (Co)', value: deviceData?.Co }].map(p => (
//                           <div key={p.label} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-red-400 transition-colors">
//                             <div className="text-xs text-gray-600 mb-1">{p.label}</div>
//                             <div className="text-lg font-semibold text-gray-900">{p.value}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConnectDevice;
