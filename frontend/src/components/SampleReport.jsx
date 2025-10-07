import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Download, MapPin, CalendarDays, FlaskConical } from "lucide-react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import axios from "axios";

function SampleDetails({ sample, onBack }) {
  if (!sample) return null;

  const waterData = Object.entries(sample.waterQuality).map(([key, value]) => ({
    name: key,
    value,
  }));
  const metalData = Object.entries(sample.metals).map(([key, value]) => ({
    name: key,
    value,
  }));
  const indexData = Object.entries(sample.indices).map(([key, value]) => {
    let adjustedValue = value;

    if (key === 'mi') {
      adjustedValue = value * 10;
    } else if (key == 'cd'){
      adjustedValue = value * 5;
    }

    return { name: key.toUpperCase(), value: adjustedValue };
  });
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  const getBadgeColor = (variant) => {
    switch (variant) {
      case "safe":
        return "bg-green-600 hover:bg-green-700 px-3 py-2 w-15 h-2 text-center";
      case "moderate":
        return "bg-yellow-600  hover:bg-yellow-700 px-3 py-2 w-15 h-2 text-center";
      case "unsafe":
        return "bg-red-600 hover:bg-red-700 px-3 py-2 w-15 h-2 text-center";
      default:
        return "";
    }
  };

  const downloadPDF = async () => {
    try {
      const captureImage = async (id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        return canvas.toDataURL("image/png");
      };
      await new Promise((r) => setTimeout(r, 300)); // wait for charts to render

      const pollutionChar = await captureImage("pollution-char");
      const pieChar = await captureImage("pie-char");
      const indexChar = await captureImage("index-char");
      const response = await axios.post(
        `/api/export/sample-pdf`,
        formData
      ,
        {
          sample,
          charts: {
            pollutionChar,
            pieChar,
            indexChar,
          },
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `Sample_Report_${sample.sampleId}.pdf`);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  return (
    <Card className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-4">
          💧 Detailed Report: {sample.sampleId}
        </CardTitle>
        <div className="flex gap-4 justify-center">
          <Button onClick={onBack} className="flex items-center gap-2">
            ← Back to Results
          </Button>
          <Button onClick={downloadPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 text-sm text-muted-foreground">
        {/* Location Details */}
        <section className="flex flex-wrap gap-4 items-center">
          <div className="text-sm text-muted-foreground leading-relaxed">
            <p>
              <MapPin className="inline-block w-4 h-4 mr-1" />{" "}
              <strong>Location:</strong> {sample.village}, {sample.block},{" "}
              {sample.district}, {sample.state}
            </p>
            <p>
              <strong>Coordinates:</strong> {sample.latitude.toFixed(4)},{" "}
              {sample.longitude.toFixed(4)}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge className={getBadgeColor(sample.category)}>
                {sample.category}
              </Badge>
            </p>
            <p>
              <CalendarDays className="inline-block w-4 h-4 mr-1" />{" "}
              <strong>Sampling Date:</strong>{" "}
              {new Date(sample.samplingDate).toLocaleDateString()}
            </p>
            <p>
              <FlaskConical className="inline-block w-4 h-4 mr-1" />{" "}
              <strong>Well Type:</strong> {sample.wellType}
            </p>
          </div>
        </section>
        <section className="flex flex-wrap gap-4 items-center">
          <h4 className="font-semibold text-primary ">💧 Water Quality</h4>
          <p>
            <strong>pH:</strong> {sample.waterQuality?.pH}
          </p>
          <p>
            <strong>TDS:</strong> {sample.waterQuality?.tds}
          </p>
          <p>
            <strong>Hardness:</strong> {sample.waterQuality?.totalHardness}
          </p>
          <p>
            <strong>Fluoride:</strong> {sample.waterQuality?.fluoride}
          </p>
          <p>
            <strong>Nitrate:</strong> {sample.waterQuality?.nitrate}
          </p>
          <p>
            <strong>Chloride:</strong> {sample.waterQuality?.chloride}
          </p>
          <p>
            <strong>Sulphate:</strong> {sample.waterQuality?.sulfate}
          </p>
          <p>
            <strong>Sodium:</strong> {sample.waterQuality?.sodium}
          </p>
          <p>
            <strong>Iron:</strong> {sample.waterQuality?.iron}
          </p>
          <p>
            <strong>Calcium:</strong> {sample.waterQuality?.calcium}
          </p>
          <p>
            <strong>Magnesium:</strong> {sample.waterQuality?.magnesium}
          </p>
          <p>
            <strong>Bicarnonate:</strong> {sample.waterQuality?.bicarbonate}
          </p>
          <p>
            <strong>Phosphate:</strong> {sample.waterQuality?.phosphate}
          </p>
        </section>

        <section className="flex flex-wrap gap-4 items-center">
          <h4 className="font-semibold text-primary ">🧪 Heavy Metals</h4>
          <p>
            <strong>Lead:</strong> {sample.metals?.lead}
          </p>
          <p>
            <strong>Uranium:</strong> {sample.metals?.uranimun}
          </p>
          <p>
            <strong>Arsenic:</strong> {sample.metals?.arsenic}
          </p>
          <p>
            <strong>Iron:</strong> {sample.metals?.iron}
          </p>
          <p>
            <strong>Mercury:</strong> {sample.metals?.mercury}
          </p>
          <p>
            <strong>Cadmium:</strong> {sample.metals?.cadmium}
          </p>
          <p>
            <strong>Chromium:</strong> {sample.metals?.chromium}
          </p>
        </section>

        {/* Indices */}
        <section className="flex flex-wrap gap-4 items-center">
          <h4 className="font-semibold text-primary ">📊 Indices</h4>
          <p>
            <strong>HPI:</strong> {sample.indices?.hpi}
          </p>
          <p>
            <strong>MI:</strong> {sample.indices?.mi}
          </p>
          <p>
            <strong>CD:</strong> {sample.indices?.cd}
          </p>
        </section>

        {/* Sampling Details */}
        <section className="flex flex-wrap gap-4 items-center">
          <h4 className="font-semibold text-primary ">🗓️ Sampling Info</h4>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(sample.samplingDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Well Type:</strong> {sample.wellType}
          </p>
        </section>

        <Separator />

        {/* Water Quality */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div id="pollution-char" className="bg-muted/30 p-4 rounded-md hover:shadow transition">
            <h4 className="font-semibold text-lg mb-2">
              🧪 Water Quality Parameters
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={waterData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            id="pie-char"
            className="bg-muted/30 p-4 rounded-md hover:shadow transition"
          >
            <h4 className="font-semibold text-lg mb-2">⚠️ Heavy Metals</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={metalData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {metalData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div
            id="index-char"
            className="md:col-span-2 bg-muted/30 p-4 rounded-md hover:shadow transition"
          >
            <h4 className="font-semibold text-lg mb-2">📊 Indices</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={indexData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heavy Metals */}

        {/* Back Button */}
        {/* <button
          onClick={onBack}
          className="mt-6 px-4 py-2 text-sm font-medium rounded-md bg-muted text-primary hover:bg-muted/80 transition"
        >
          ← Back to Results
        </button> */}
      </CardContent>
    </Card>
  );
}

export default SampleDetails;
