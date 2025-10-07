import axios from 'axios';
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, MapPin, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import SampleDetails from './SampleReport';
import Analytics from './predict';

// Map button card
export function HomeCard({ setActiveSection }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Geospatial Map</CardTitle>
        <CardDescription>Map visualization placeholder</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Button onClick={() => setActiveSection("map")}>Go to Map</Button>
        </div>
      </CardContent>
    </Card>
  );

}

const Results = ({ data: initialData, setActiveSection }) => {
  const { toast } = useToast();
  const [data, setData] = useState(initialData || []);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [totalSamples, setTotalSamples] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [avgData , setAvgData] = useState([]);

  const visibleData = showAll
    ? [...data].sort((a, b) => parseInt(a.sampleId) - parseInt(b.sampleId))
    : [...data]
        .sort((a, b) => parseInt(a.sampleId) - parseInt(b.sampleId))
        .slice(0, 15);

  const showToast = (title, description, variant = "default") => {
    setToastMessage({ title, description, variant });
    setTimeout(() => setToastMessage(null), 3000);
  };
  // Fetch chart data
  useEffect(() => {
    axios.get(`/api/charts/pollution-indices`)
      .then((res) => {
        const formatted = res.data.map((entry) => ({
          name: entry._id,
          HPI: parseFloat(entry.avgHPI.toFixed(3)),
          MI: parseFloat((entry.avgMI * 10).toFixed(3)),
          Cd: parseFloat((entry.avgCD * 5 ).toFixed(3)),
        }));
        setChartData(formatted);
      })
      .catch((err) => {
        console.error("Failed to fetch chart data:", err);
        toast({
          title: "Chart data error",
          description: "Unable to load pollution indices.",
        });
      });
  }, []);

  const contaminationTrends = [
    { month: 'Jan', unsafe: 45, moderate: 32, safe: 123 },
    { month: 'Feb', unsafe: 52, moderate: 38, safe: 110 },
    { month: 'Mar', unsafe: 48, moderate: 35, safe: 117 },
    { month: 'Apr', unsafe: 58, moderate: 42, safe: 100 },
    { month: 'May', unsafe: 63, moderate: 45, safe: 92 },
    { month: 'Jun', unsafe: 71, moderate: 48, safe: 81 }
  ];

  // Fetch sample data
  useEffect(() => {
    axios.get(`/api/samples`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching samples:", err);
        toast({
          title: "Sample fetch error",
          description: "Unable to load sample data.",
        });
        setLoading(false);
      });
  }, []);

  // Fetch pie chart summary
  useEffect(() => {
    axios.get(`/api/summary`)

      .then((res) => {
        const categories = res.data.categories;
        const total = res.data.totalSamples;

        const formatted = categories.map((cat) => ({
          name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
          value: cat.count,
          color:
            cat._id === "safe"
              ? "#22c55e"
              : cat._id === "moderate"
              ? "#f59e0b"
              : "#ef4444",
        }));

        setPieData(formatted);
        setTotalSamples(total);
      })
      .catch((err) => {
        console.error("Failed to fetch category summary:", err);
      });
  }, []);

//   useEffect(() => {
//   axios
//     .get("http://localhost:5000/api/averages")
//     .then((res) => {
//       const data = res.data.data;

//       const formatted = Object.entries(data)
//         .filter(([key]) => key !== "_id")
//         .map(([key, value]) => {
//           const scaledValue = value < 5 ? value * 5 : value;
//           return {
//             name: key.replace(/^avg/, '').replace(/([A-Z])/g, ' $1').trim(),
//             value: parseFloat(scaledValue.toFixed(2)) || 0,
//             color: "#" + Math.floor(Math.random() * 16777215).toString(16)
//           };
//         });

//       setAvgData(formatted);
//     })
//     .catch((err) => {
//       console.error("Failed to fetch averages:", err);
//       toast({
//         title: "Averages error",
//         description: "Unable to load average parameter data.",
//       });
//     });
// }, []);


  const unsafeCount = pieData
    .filter((item) => item.name === "Unsafe")
    .reduce((sum, item) => sum + item.value, 0);

  const downloadCSV = async () => {
    try {
      toast({
        title: "Exporting Data",
        description: "Preparing CSV file...",
        variant: "default",
      });
const response = await axios.get(`/api/export/csv`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, "Water_Analysis_Data.csv");

      toast({
        title: "CSV Exported",
        description: "Your data has been saved as CSV.",
      });
    } catch (error) {
      console.error("CSV export failed:", error);
      toast({
        title: "Export Failed",
        description: "Unable to export CSV data.",
        variant: "destructive",
      });
    }
  };

  const downloadPdf = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Preparing your PDF report with charts and map...",
        variant: "default",
      });

      const captureImage = async (id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const canvas = await html2canvas(el);
        return canvas.toDataURL("image/png");
      };

      const pollutionChart = await captureImage("pollution-chart");
      const pieChart = await captureImage("pie-chart");
      const avgDatashot = await captureImage("average-chart");
      
const response = await axios.post(
  `/api/export/pdf`,
  formData
,
        {
          samples: data,
          charts: {
            pollutionChart,
            pieChart,
            avgDatashot,
          },
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, "Water_Analysis_Report.pdf");
      showToast("Report Ready", "Your PDF report has been downloaded.", "success");
    } catch (error) {
      console.error("PDF download failed:", error);
      showToast( "Download Failed", "Something went wrong while generating the report.","destructive");
    }
  };

  const getBadgeColor = (variant) => {
    switch (variant) {
      case "safe":
        return "bg-green-600 hover:bg-green-700";
      case "moderate":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "unsafe":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "";
    }
  };

  const handleRowClick = (sample) => {
    setSelectedSample(sample);
  };

  const handleBack = () => {
    setSelectedSample(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header and Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
        <div>
          <h1 className="text-2xl font-bold">Water Quality Analysis Results</h1>
          <p className="text-muted-foreground">
            Analysis of {totalSamples !== null ? totalSamples : "Loading..."} water samples
          </p>
        </div>
        <Button onClick={downloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download CSV
        </Button>
        <Button onClick={downloadPdf} className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 p-6 rounded-xl border border-border/40 shadow-sm">
        {/* Pie Chart Card */}
        <Card id="pie-chart" className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Contamination Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      className='text-base'
                    >
                      {pieData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center">No data available</p>
              )}
            </div>

            {/* <div className="w-full md:w-1/3 space-y-3">
              {pieData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: entry.color }}></span>
                    <span className="text-sm ">{entry.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{entry.value}</span>
                </div>
              ))}
            </div> */}
          </CardContent>
        </Card>

        {/* Pollution Chart Card */}
        <Card id="pollution-chart" className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Indices Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="HPI" fill="#9223ecff" name=" Avg HPI" />
                  <Bar dataKey="MI" fill="#362cf2ff" name="Avg MI (×10)" />
<Bar dataKey="Cd" fill="#ef4444" name="Avg CD (×5)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">No chart data available</p>
            )}
          </CardContent>
        </Card>

        {/* <Card id="average-chart" className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">Average Water & Metal Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            {avgData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={avgData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Average Value">
                    {avgData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center">No average data available</p>
            )}
          </CardContent>
        </Card> */}


        {/* Risk Assessment Card */}
        <Card className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">6 month Contamination Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pieData.map((item) => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value} samples</span>
                </div>
              ))}

              {unsafeCount > 0 && (
                <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-3">Warning</p>
                    <p className="text-xs text-red-700">{unsafeCount} water samples exceed safe contamination limits and need attention.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Button */}
      {/* <Analytics /> */}
      {/* <HomeCard setActiveSection={setActiveSection} /> */}

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Click a sample to view detailed report</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6 text-muted-foreground text-sm">
              Loading Table data…
            </div>
          ) : selectedSample ? (
            <SampleDetails sample={selectedSample} onBack={handleBack} />
          ) : (
            <div className="rounded-md border">
              <Table className="min-w-full divide-y divide-gray-200 text-sm rounded-xl overflow-hidden shadow-lg border border-gray-300 bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>HPI</TableHead>
                    <TableHead>MI</TableHead>
                    <TableHead>CD</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...visibleData]
                    .sort((a, b) => {
                      const idA = parseInt(a.sampleId.replace(/\D/g, "")) || 0;
                      const idB = parseInt(b.sampleId.replace(/\D/g, "")) || 0;
                      return idA - idB;
                    })
                    .slice(0, showAll ? visibleData.length : 15)
                    .map((sample) => (
                      <TableRow key={sample.sampleId} onClick={() => handleRowClick(sample)} className="cursor-pointer hover:bg-gray-50 transition"><TableCell className="px-10">{sample.sampleId}</TableCell>
                        <TableCell className="translate-x-[-30px]">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{sample.latitude.toFixed(4)}, {sample.longitude.toFixed(4)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{sample.indices.hpi}</TableCell>
                        <TableCell>{sample.indices.mi}</TableCell>
                        <TableCell>{sample.indices.cd}</TableCell>
                        <TableCell>
  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
    sample.category === 'unsafe' ? 'bg-red-100 text-red-700' :
    sample.category === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
    'bg-green-100 text-green-700'
  }`}>
    {sample.category}
  </span>
</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
          {data.length > 15 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition"
              >
                {showAll ? "Show Less" : `Show All (${data.length})`}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Results;
