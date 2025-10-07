import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, TrendingUp, Users, Droplets, MapPin, FileText, Target, Award, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GeospatialPolicyDashboard = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const navigate = useNavigate();

  const goToMap = () => {
    navigate('/map'); // or whatever your route is
  };

  
  const contaminationTrends = [
    { month: 'Jan', unsafe: 45, moderate: 32, safe: 123 },
    { month: 'Feb', unsafe: 52, moderate: 38, safe: 110 },
    { month: 'Mar', unsafe: 48, moderate: 35, safe: 117 },
    { month: 'Apr', unsafe: 58, moderate: 42, safe: 100 },
    { month: 'May', unsafe: 63, moderate: 45, safe: 92 },
    { month: 'Jun', unsafe: 71, moderate: 48, safe: 81 }
  ];

  const regionalData = [
    { region: 'North Delhi', affected: 12500, population: 45000, severity: 'High' },
    { region: 'South Delhi', affected: 8300, population: 52000, severity: 'Medium' },
    { region: 'East Delhi', affected: 15200, population: 48000, severity: 'Critical' },
    { region: 'West Delhi', affected: 9800, population: 41000, severity: 'Medium' },
    { region: 'Central Delhi', affected: 6200, population: 35000, severity: 'Low' }
  ];

  const interventionImpact = [
    { name: 'Q1 2024', before: 68, after: 52 },
    { name: 'Q2 2024', before: 71, after: 45 },
    { name: 'Q3 2024', before: 65, after: 38 },
    { name: 'Q4 2024', before: 73, after: 41 }
  ];

  const budgetAllocation = [
    { category: 'Water Treatment', allocated: 450, utilized: 385 },
    { category: 'Testing Equipment', allocated: 180, utilized: 165 },
    { category: 'Public Awareness', allocated: 95, utilized: 88 },
    { category: 'Emergency Response', allocated: 275, utilized: 240 }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const openMapInNewWindow = () => {
    window.open('/map', '_blank', 'width=1200,height=800');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Policy Impact Analysis</h1>
              <p className="text-gray-600 mt-1">Water quality monitoring and intervention assessment</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last Updated</div>
              <div className="text-lg font-semibold text-gray-900">October 5, 2025</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Map className="h-6 w-6" />
                  Geospatial Contamination Map
                </CardTitle>
                <CardDescription className="text-blue-50 mt-1">
                  View interactive map of water quality sample locations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
              <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map Viewer</h3>
              <p className="text-gray-600 mb-6">Click below to open the geospatial map in a new window</p>
              <Button 
                onClick={openMapInNewWindow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
              >
                <MapPin className="mr-2 h-5 w-5" />
                Open Map in New Window
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Critical Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-900">18</div>
              <p className="text-sm text-red-700 mt-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +3 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Population Affected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-900">52,000+</div>
              <p className="text-sm text-blue-700 mt-2">Across Delhi NCR</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Compliance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-900">73%</div>
              <p className="text-sm text-green-700 mt-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                +8% from Q1
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Budget Utilized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-900">₹870Cr</div>
              <p className="text-sm text-purple-700 mt-2">87% of allocated</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border shadow-sm">
            <TabsTrigger 
              value="trends"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Trends
            </TabsTrigger>
            <TabsTrigger 
              value="regional"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Regional
            </TabsTrigger>
            <TabsTrigger 
              value="interventions"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Impact
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle>6-Month Contamination Trends</CardTitle>
                <CardDescription>Monthly water quality distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={contaminationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="unsafe" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="moderate" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="safe" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Key Observation</h4>
                      <p className="text-sm text-amber-800">
                        Unsafe samples increased by 58% over 6 months. Immediate policy intervention needed.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6 mt-6">
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle>Regional Hotspots</CardTitle>
                <CardDescription>Population impact by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionalData.map((region, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-lg">{region.region}</h3>
                            <p className="text-sm text-gray-600">
                              {region.affected.toLocaleString()} / {region.population.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getSeverityColor(region.severity)} text-white px-3 py-1`}>
                          {region.severity}
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-red-600 h-3 rounded-full"
                          style={{ width: `${(region.affected / region.population) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((region.affected / region.population) * 100).toFixed(1)}% affected
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-md">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Intervention Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={interventionImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="before" fill="#ef4444" name="Before" />
                      <Bar dataKey="after" fill="#22c55e" name="After" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="bg-gray-50">
                  <CardTitle>Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={budgetAllocation} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="allocated" fill="#3b82f6" />
                      <Bar dataKey="utilized" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle>Success Stories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Award className="h-6 w-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">South Delhi Success</h4>
                      <p className="text-sm text-green-800">
                        65% reduction in heavy metal contamination in 8 months through advanced filtration.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Award className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Community Engagement</h4>
                      <p className="text-sm text-blue-800">
                        Reached 2.3M residents, 45% increase in testing requests for early detection.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <Card className="shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle>Immediate Actions (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-600">Critical</Badge>
                        <h3 className="font-semibold">East Delhi Emergency</h3>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Deploy 15 mobile treatment units</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Budget: ₹45 Cr</span>
                      <span>Timeline: 7 days</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-orange-600">High</Badge>
                        <h3 className="font-semibold">Groundwater Mapping</h3>
                      </div>
                      <Badge variant="outline">Ready</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">Survey contamination sources</p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Budget: ₹28 Cr</span>
                      <span>Timeline: 30 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader className="bg-gray-50">
                <CardTitle>Strategic Plans (6-12 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Policy Enhancement
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1 ml-7 list-disc">
                      <li>Revise national standards for emerging contaminants</li>
                      <li>Mandatory quarterly testing for public sources</li>
                      <li>Penalty framework for industrial violations</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Infrastructure
                    </h4>
                    <ul className="text-sm text-purple-800 space-y-1 ml-7 list-disc">
                      <li>50 new real-time monitoring stations</li>
                      <li>Upgrade treatment capacity in 12 zones</li>
                      <li>IoT-based early warning system</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 py-6">
                <FileText className="mr-2 h-5 w-5" />
                Generate Report
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 py-6">
                <Target className="mr-2 h-5 w-5" />
                Submit for Review
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-white border-t py-6">
          <div className="container mx-auto px-6 text-center text-sm text-gray-600">
            <p>National Water Quality Monitoring Network | Real-time updates</p>
            <p className="mt-1">support@jalshakti.gov.in | Helpline: 1800-11-WATER</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeospatialPolicyDashboard;