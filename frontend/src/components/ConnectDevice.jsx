import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity, Droplets, CheckCircle, Loader2, Radio, Signal, Battery } from 'lucide-react';

// --- START: Custom UI Components (Mimicking shadcn/ui with Tailwind) ---
// Note: These custom components apply the exact styling requested by the user.

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border shadow-sm ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);
const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);
const Button = ({ children, onClick, variant = 'default', className = '', disabled = false }) => {
    let baseStyle = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 shadow-md';
    
    // Default and Destructive variants use standard styling unless overridden by className
    if (variant === 'destructive') {
        baseStyle = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 shadow-md bg-red-600 hover:bg-black text-white';
    } else if (variant === 'default') {
        baseStyle = 'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 shadow-md bg-blue-600 hover:bg-blue-700 text-white';
    }
    
    // className overrides any variant styling if specified
    return (
        <button onClick={onClick} className={`${baseStyle} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};
const Alert = ({ children, className = '' }) => (
    <div className={`relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${className}`}>{children}</div>
);
const AlertDescription = ({ children, className = '' }) => (
    <div className={`text-sm ${className}`}>{children}</div>
);
// --- END: Custom UI Components ---


const App = () => {
    const [deviceId, setDeviceId] = useState(''); 
    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [deviceData, setDeviceData] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [availableDevices, setAvailableDevices] = useState([]);
    const [dataInterval, setDataInterval] = useState(null);

    // --- HPI CONSTANTS (mg/L) ---
    const HPI_CONSTANTS = {
        // Standard Limits (Si) - Maximum Permissible (BIS IS 10500:2012)
        standards: {
            Pb: 0.01, Cd: 0.003, Cr: 0.05, Ni: 0.1, As: 0.01,
            Hg: 0.001, Fe: 0.3, Cu: 1.0, Zn: 5.0, Mn: 0.3, Co: 0.05
        },
        // Unit Weights (Wi) - Relative importance/toxicity
        weights: {
            Pb: 0.15, Cd: 0.15, Cr: 0.1, Ni: 0.1, As: 0.15,
            Hg: 0.15, Fe: 0.05, Cu: 0.05, Zn: 0.05, Mn: 0.03, Co: 0.02
        }
    };

    // --- Data generator based on BIS IS 10500:2012 ranges ---
    const generateReading = () => ({
        // Basic parameters
        pH: (6.5 + Math.random() * 2).toFixed(2), // Range: 6.5–8.5
        EC: (200 + Math.random() * 800).toFixed(0), // µS/cm
        temperature: (20 + Math.random() * 10).toFixed(1), // °C
        DO: (4 + Math.random() * 6).toFixed(2), // mg/L

        // Major ions (mg/L)
        CO3: (Math.random() * 10).toFixed(2),
        HCO3: (Math.random() * 400).toFixed(1),
        Cl: (Math.random() * 250).toFixed(1),
        F: (Math.random() * 1.0).toFixed(2),
        SO4: (Math.random() * 200).toFixed(1),
        NO3: (Math.random() * 45).toFixed(1),
        PO4: (Math.random() * 0.3).toFixed(2),

        // Heavy Metals (Mi) for HPI calculation (mg/L)
        Pb: (Math.random() * 0.01).toFixed(3),
        Cd: (Math.random() * 0.003).toFixed(3),
        Cr: (Math.random() * 0.05).toFixed(3),
        Ni: (Math.random() * 0.1).toFixed(3),
        As: (Math.random() * 0.01).toFixed(3),
        Hg: (Math.random() * 0.001).toFixed(4),
        Fe: (Math.random() * 0.3).toFixed(3),
        Cu: (Math.random() * 1.0).toFixed(2),
        Zn: (Math.random() * 5.0).toFixed(2),
        Mn: (Math.random() * 0.3).toFixed(2),
        Co: (Math.random() * 0.05).toFixed(3),

        timestamp: new Date().toLocaleTimeString(),
    });

    // --- HPI calculation logic ---
    const calculateHPI = (data) => {
        if (!data) return 0;

        const { standards, weights } = HPI_CONSTANTS;
        let hpiSum = 0, weightSum = 0;

        // Formula: HPI = Sum(Wi * Qi) / Sum(Wi), where Qi = (Mi / Si) * 100
        for (const metal in standards) {
            const mi = parseFloat(data[metal]); // Measured Concentration
            const si = standards[metal];        // Standard Limit
            const wi = weights[metal];          // Unit Weight
            
            const qi = (mi / si) * 100; // Sub-index calculation
            
            hpiSum += qi * wi;
            weightSum += wi;
        }
        
        if (weightSum === 0) return (0).toFixed(2);
        return (hpiSum / weightSum).toFixed(2);
    };

    const getHPIStatus = (hpi) => {
        const hpiNum = parseFloat(hpi);
        // HPI Thresholds
        if (hpiNum < 25) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
        if (hpiNum < 50) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
        if (hpiNum < 75) return { text: 'Poor', color: 'text-orange-600', bg: 'bg-orange-50' };
        return { text: 'Very Poor', color: 'text-red-600', bg: 'bg-red-50' };
    };


    // --- Device Connection Logic ---

    const scanForDevices = () => {
        setIsScanning(true);
        setConnectionStatus('scanning');
        setTimeout(() => {
            const mockDevices = [
                { id: 'AQ-WQ-001', name: 'AquaSense Pro', signal: 95, battery: 87 },
                { id: 'AQ-WQ-002', name: 'AquaSense Pro', signal: 78, battery: 92 },
                { id: 'AQ-WQ-003', name: 'AquaSense Pro', signal: 65, battery: 45 },
            ];
            setAvailableDevices(mockDevices);
            setIsScanning(false);
            setConnectionStatus('devices_found');
        }, 2000); // 2 second scan time
    };

    const startDataStream = (id) => {
        setDeviceId(id);
        setDeviceData(generateReading());
        const interval = setInterval(() => setDeviceData(generateReading()), 5000); // 5 second data update
        setDataInterval(interval);
    };

    const connectToDevice = (device) => {
        setConnectionStatus('connecting');
        setTimeout(() => {
            setIsConnected(true);
            setConnectionStatus('connected');
            startDataStream(device.id); // Pass the ID to the data stream
        }, 1500); // 1.5 second connection time
    };

    const disconnectDevice = () => {
        if (dataInterval) {
            clearInterval(dataInterval);
            setDataInterval(null);
        }
        setIsConnected(false);
        setConnectionStatus('disconnected');
        setDeviceData(null);
        setDeviceId('');
        setAvailableDevices([]);
    };

    useEffect(() => {
        return () => {
            if (dataInterval) {
                clearInterval(dataInterval);
            }
        };
    }, [dataInterval]);

    const hpiValue = calculateHPI(deviceData);
    const hpiStatus = getHPIStatus(hpiValue);

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* UPDATED: Main Title Text */}
                <h1 className="text-2xl font-bold mb-6 font-sans text-gray-800">Connect To IoT Heavy Metal Detection Device</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Connection & HPI */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* CONNECTION STATUS CARD */}
                        <Card className="border-2 border-blue-300 shadow-lg rounded-lg">
                            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg p-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Radio className="h-5 w-5" /> Device Connection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                {connectionStatus === 'disconnected' && (
                                    <div className="text-center">
                                        {/* Adjusted Spacing */}
                                        <div className="py-8"> 
                                            <WifiOff className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-600 mb-6">No device connected</p>
                                        </div>
                                        
                                        <Button 
                                            onClick={scanForDevices} 
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full shadow-lg hover:shadow-xl"
                                        >
                                            <Wifi className="mr-2" /> Scan for Devices
                                        </Button>

                                        {/* Manual Connection Area */}
                                        <div className="mt-6 pt-6 border-t border-gray-100 text-left">
                                            <p className="text-sm text-gray-600 mb-1">Or enter Device ID manually:</p>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    placeholder="AQ-WQ-XXX"
                                                    value={deviceId}
                                                    onChange={(e) => setDeviceId(e.target.value)}
                                                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                />
                                                <button
                                                    onClick={() => connectToDevice({ id: deviceId || 'AQ-WQ-MANUAL', name: 'Manual Device', signal: 'N/A', battery: 'N/A' })}
                                                    disabled={!deviceId}
                                                    className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                                                >
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {connectionStatus === 'scanning' && (
                                    <div className="text-center py-6">
                                        <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin mb-3" />
                                        <p className="text-gray-600">Scanning...</p>
                                    </div>
                                )}
                                {connectionStatus === 'devices_found' && (
                                    <div className="space-y-3">
                                        {/* UPDATED: Increased vertical spacing below heading */}
                                        <p className="font-medium mb-5">Available Devices:</p>
                                        {availableDevices.map(d => (
                                            <div key={d.id} onClick={() => connectToDevice(d)} className="p-3 border rounded-lg hover:bg-blue-50 cursor-pointer transition shadow-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium text-gray-800">{d.name}</p>
                                                        <p className="text-sm text-gray-500">{d.id}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                                                        <Signal className="h-4 w-4" />
                                                        <span>{d.signal}%</span>
                                                        <Battery className="h-4 w-4 ml-2" />
                                                        <span>{d.battery}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {connectionStatus === 'connecting' && (
                                    <div className="text-center py-6">
                                        <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin mb-3" />
                                        <p className="text-gray-600">Connecting...</p>
                                    </div>
                                )}
                                {connectionStatus === 'connected' && (
                                    <div className="text-center space-y-4">
                                        {/* UPDATED: Changed mb-6 to my-6 for better top/bottom spacing */}
                                        <div className="bg-green-100 border border-green-300 p-4 rounded-lg my-6 text-green-800 text-left">
                                            <div className="flex items-start">
                                                <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-green-600" />
                                                <div>
                                                    <p className="font-bold">Connected Successfully!</p>
                                                    <p className="text-sm mt-1">Device ID: {deviceId}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pulsing Graphic */}
                                        <div className="flex justify-center my-8">
                                            <div className="relative h-28 w-28 flex items-center justify-center">
                                                <Wifi className="h-24 w-24 text-green-400 absolute animate-[pulse_1.5s_cubic-bezier(0.4,0,0.6,1)_infinite]" strokeWidth={1} />
                                                <Activity className="h-12 w-12 text-green-600 relative z-10" strokeWidth={2.5} />
                                            </div>
                                        </div>
                                        
                                        {/* Status/Data Rate/Last Update */}
                                        <div className="space-y-3 text-sm text-gray-700 mt-6 text-left">
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="font-medium">Status:</span>
                                                <span className="flex items-center text-green-600 font-semibold">
                                                    <span className="h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                                                    Active
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center border-b pb-2">
                                                <span className="font-medium">Data Rate:</span>
                                                <span>5 sec/update</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Last Update:</span>
                                                <span>{deviceData?.timestamp || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Disconnect Button */}
                                        <Button
                                            variant="destructive"
                                            onClick={disconnectDevice}
                                            className="w-full bg-red-600 hover:bg-black mt-8" 
                                        >
                                            Disconnect Device
                                        </Button>
                                    </div>
                                )}
                           </CardContent>
                        </Card>

                        {/* HPI Card */}
                        {isConnected && deviceData && (
                            <Card className="border-2 shadow-lg rounded-lg">
                                <CardHeader className='p-4'>
                                    <CardTitle className="text-lg">Heavy Metal Pollution Index (HPI)</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center p-6 pt-0">
                                    <div className={`text-5xl font-bold ${hpiStatus.color}`}>{hpiValue}</div>
                                    <div className={`text-lg font-semibold ${hpiStatus.color}`}>{hpiStatus.text}</div>
                                    <div className="mt-4 w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                        <div
                                            className="h-3 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(parseFloat(hpiValue), 100)}%`,
                                                backgroundColor:
                                                    hpiValue < 25
                                                        ? '#16a34a'
                                                        : hpiValue < 50
                                                            ? '#2563eb'
                                                            : hpiValue < 75
                                                                ? '#ea580c'
                                                                : '#dc2626',
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Live Data */}
                    <div className="lg:col-span-2">
                        {/* LIVE DATA CARD */}
                        <Card className="border-2 border-blue-300 shadow-lg h-full rounded-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
                                <CardTitle className="text-lg flex items-center gap-2 text-white">
                                    <Droplets className="h-5 w-5" /> Live Water Quality Parameters
                                </CardTitle>
                                {/* UPDATED: Font color for visibility */}
                                <CardDescription className="text-gray-200">
                                    Real-time measurements from connected device
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {!isConnected ? (
                                    /* Disconnected Message with Pulse Graphic */
                                    <div className="text-center py-20 text-gray-500">
                                        <Activity className="h-20 w-20 mx-auto text-gray-300 mb-4 stroke-1" />
                                        <div className="text-lg">Connect a device to view live data</div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Basic Parameters - UPDATED: Added pt-4 for extra spacing */}
                                        <div className='border-b pb-4 pt-4'>
                                            <h3 className="font-semibold text-lg mb-3 text-blue-900">Basic Parameters</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[{ label: 'pH', value: deviceData?.pH, unit: '' },
                                                  { label: 'EC', value: deviceData?.EC, unit: 'µS/cm' },
                                                  { label: 'Temperature', value: deviceData?.temperature, unit: '°C' },
                                                  { label: 'Dissolved Oxygen', value: deviceData?.DO, unit: 'mg/L' }].map(p => (
                                                    <div key={p.label} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 shadow-md">
                                                        <div className="text-sm text-gray-600 mb-1">{p.label}</div>
                                                        <div className="text-2xl font-bold text-blue-900">{p.value}</div>
                                                        <div className="text-xs text-gray-500">{p.unit}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Major Ions */}
                                        <div className='border-b pb-4'>
                                            <h3 className="font-semibold text-lg mb-3 text-blue-900">Major Ions (mg/L)</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[{ label: 'CO₃', value: deviceData?.CO3 },
                                                  { label: 'HCO₃', value: deviceData?.HCO3 },
                                                  { label: 'Cl', value: deviceData?.Cl },
                                                  { label: 'F', value: deviceData?.F },
                                                  { label: 'SO₄', value: deviceData?.SO4 },
                                                  { label: 'NO₃', value: deviceData?.NO3 },
                                                  { label: 'PO₄', value: deviceData?.PO4 }].map(p => (
                                                    <div key={p.label} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors shadow-sm">
                                                        <div className="text-xs text-gray-600 mb-1">{p.label}</div>
                                                        <div className="text-lg font-semibold text-gray-900">{p.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Heavy Metals */}
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 text-red-900">Heavy Metals (mg/L)</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {[{ label: 'Lead (Pb)', value: deviceData?.Pb },
                                                  { label: 'Cadmium (Cd)', value: deviceData?.Cd },
                                                  { label: 'Chromium (Cr)', value: deviceData?.Cr },
                                                  { label: 'Nickel (Ni)', value: deviceData?.Ni },
                                                  { label: 'Arsenic (As)', value: deviceData?.As },
                                                  { label: 'Mercury (Hg)', value: deviceData?.Hg },
                                                  { label: 'Iron (Fe)', value: deviceData?.Fe },
                                                  { label: 'Copper (Cu)', value: deviceData?.Cu },
                                                  { label: 'Zinc (Zn)', value: deviceData?.Zn },
                                                  { label: 'Manganese (Mn)', value: deviceData?.Mn },
                                                  { label: 'Cobalt (Co)', value: deviceData?.Co }].map(p => (
                                                    <div key={p.label} className="bg-white p-3 rounded-lg border border-gray-200 hover:border-red-400 transition-colors shadow-sm">
                                                        <div className="text-xs text-gray-600 mb-1">{p.label}</div>
                                                        <div className="text-lg font-semibold text-gray-900">{p.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
