import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  HelpCircle,
  ListChecks,
} from "lucide-react";


const DataUpload = ({ onDataUpload, onSectionChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidData, setIsValidData] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploading, setUploading] = useState(false); // ✅ Added missing state

  // Updated required columns
  const requiredColumns = [
    "S. No. (Sample ID)",
    "Longitude",
    "Latitude",
    "pH",
    "CO3 (mg/L)",
    "HCO3",
    "Cl (mg/L)",
    "F (mg/L)",
    "SO4",
    "NO3",
    "PO4",
    "Total Hardness",
    "Ca (mg/L)",
    "Mg (mg/L)",
    "Na (mg/L)",
    "K (mg/L)",
    "Fe (ppm)",
    "As (ppb)",
    "U (ppb)",
  ];

  const showToast = (title, description, variant = "default") => {
    setToastMessage({ title, description, variant });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      showToast("Invalid file format", "Please upload a CSV file", "destructive");
      return;
    }
    setUploadedFile(file);
    validateCSV(file);
  };

  const validateCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n");
      const headers = rows[0].split(",").map((h) => h.trim());

      const errors = [];
      requiredColumns.forEach((col) => {
        if (
          !headers.includes(col) &&
          !(col === "S. No. (Sample ID)" && headers.includes("S. No."))
        ) {
          errors.push(`Missing required column: ${col}`);
        }
      });

      if (rows.length < 2) errors.push("CSV file must contain at least one data row");

      setValidationErrors(errors);
      setIsValidData(errors.length === 0);

      if (errors.length === 0)
        showToast("File validated successfully", "Ready for analysis", "success");
    };
    reader.readAsText(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setValidationErrors([]);
    setIsValidData(false);
  };

  const downloadSampleCSV = () => {
    const headers = requiredColumns.join(",");
    const rows = [
      requiredColumns.map((c) => (c === "S. No. (Sample ID)" ? 1 : "-")).join(","),
    ];
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "water_quality_sample.csv");
    a.click();
  };

  // ✅ FIXED proceedToAnalysis function
  const proceedToAnalysis = async () => {
    if (!isValidData) {
      showToast("Invalid Data", "Please fix validation errors first", "destructive");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      
      const response = await axios.post(
        `/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutes
        }
      );

      console.log('✅ Upload response:', response.data);

      showToast(
        "Success",
        `${response.data.count} samples uploaded successfully! Redirecting...`,
        "success"
      );

      // Wait a bit before redirecting
      setTimeout(() => {
        if (onSectionChange) {
          onSectionChange("results");
        }
      }, 1500);

    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Could not upload file";

      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.details || error.response.data?.error || errorMessage;
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = "No response from server. Check if backend is running.";
        console.error('No response:', error.request);
      } else {
        errorMessage = error.message;
      }

      showToast("Upload Failed", errorMessage, "destructive");
    } finally {
      setUploading(false);
    }
  };

  const primaryButtonClass =
    "px-6 py-3 text-base rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2";
  const chooseFileClass =
    "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white " +
    primaryButtonClass;
  const proceedClass =
    "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white " +
    primaryButtonClass;
  const cancelClass =
    "bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white " +
    primaryButtonClass;
  const downloadClass =
    "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 text-base rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 w-full";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-6">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
          <Alert
            className={`shadow-lg ${
              toastMessage.variant === "destructive"
                ? "bg-red-50 border-red-300"
                : toastMessage.variant === "success"
                ? "bg-green-50 border-green-300"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <AlertDescription>
              <p className="font-semibold">{toastMessage.title}</p>
              <p className="text-sm">{toastMessage.description}</p>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 filter brightness-90 text-white py-6">
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <Upload className="h-7 w-7" />
                Upload Data File
              </CardTitle>
              <CardDescription className="text-blue-100 text-base mt-2">
                Select a CSV file from your device to begin analysis
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {!uploadedFile ? (
                <div
                  className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-blue-100 rounded-full">
                      <Upload className="h-14 w-14 text-blue-700" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Drag and drop your CSV file here
                    </h3>
                    <p className="text-gray-600 text-lg">or click below to browse</p>

                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                      disabled={uploading}
                    />
                    <Button asChild className={chooseFileClass}>
                      <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Choose File to Upload
                      </label>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 border rounded-lg bg-blue-50 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-700 rounded-md">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-base">{uploadedFile.name}</p>
                        <p className="text-gray-600 text-sm">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={removeFile}
                        title="Remove file"
                        className="p-2 rounded-md hover:bg-red-50 transition"
                        disabled={uploading}
                      >
                        <X className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {validationErrors.length > 0 && (
                    <Alert variant="destructive" className="border-2 shadow-md">
                      <AlertCircle className="h-5 w-5" />
                      <AlertDescription>
                        <div className="mt-2">
                          <p className="font-semibold text-lg mb-2">Please fix the following errors:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {validationErrors.map((error, index) => (
                              <li key={index} className="text-sm">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isValidData && !uploading && (
                    <Alert className="bg-green-50 border border-green-300 text-green-700 py-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-700" />
                      <AlertDescription className="font-medium">
                        File validated successfully! Ready for analysis.
                      </AlertDescription>
                    </Alert>
                  )}

                  {uploading && (
                    <Alert className="bg-blue-50 border border-blue-300 text-blue-700 py-3">
                      <AlertDescription className="font-medium flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                        Uploading and processing... Please wait.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      onClick={proceedToAnalysis}
                      disabled={!isValidData || uploading}
                      className={`${proceedClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          <span>Proceed to Analysis</span>
                        </>
                      )}
                    </Button>

                    <Button 
                      onClick={removeFile} 
                      className={cancelClass}
                      disabled={uploading}
                    >
                      <X className="h-5 w-5" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="shadow-2xl border-0 overflow-hidden sticky top-6">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 filter brightness-90 text-white py-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ListChecks className="h-6 w-6" />
                Data Requirements
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-blue-700" />
                  Required Columns
                </h3>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 max-h-96 overflow-y-auto">
                  <div className="space-y-2">
                    {requiredColumns.map((col, index) => (
                      <div
                        key={index}
                        className="px-3 py-2 rounded-lg border border-blue-200 bg-white shadow-sm hover:shadow-md transition"
                      >
                        <span className="text-sm font-medium text-gray-700">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-green-700" />
                  Need Help?
                </h3>

                <Button onClick={downloadSampleCSV} className={downloadClass}>
                  <FileText className="h-5 w-5" />
                  <span>Download Sample CSV</span>
                </Button>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4 shadow-md">
                  <p className="text-sm text-amber-900 font-medium flex items-start gap-2">
                    <span className="text-xl mt-0.5">⚠️</span>
                    <span>
                      Ensure your CSV contains all required columns with proper data types.
                      Numeric values should be valid numbers, and location data must include valid coordinates.
                    </span>
                  </p>
                </div>
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;