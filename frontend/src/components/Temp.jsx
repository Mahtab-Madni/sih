import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, FlaskConical, MapPin, TrendingUp, Shield, FileBarChart, Sparkles, Zap, Database, Globe2, Command, BarChart3, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = ({ onSectionChange }) => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const totalPartners = 6;

  const nextLogo = () => {
    setCurrentLogoIndex((prev) => (prev + 1) % totalPartners);
  };

  const prevLogo = () => {
    setCurrentLogoIndex((prev) => (prev - 1 + totalPartners) % totalPartners);
  };
  const platformFeatures = [
    {
      icon: Upload,
      title: 'Seamless Data Upload',
      description: 'Upload your water sample data in multiple formats (CSV, Excel, JSON) with instant validation and error detection.',
      color: 'from-blue-500 to-cyan-500',
      action: 'upload'
    },
    {
      icon: Command,
      title: 'IoT Device Integration',
      description: 'Connect heavy metal detection devices directly to the platform for real-time data streaming and automated analysis.',
      color: 'from-purple-500 to-pink-500',
      action: 'connect'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics Dashboard',
      description: 'View comprehensive contamination indices (HPI, MI, Cd) with interactive charts, trends, and predictive insights.',
      color: 'from-green-500 to-emerald-500',
      action: 'results'
    },
    {
      icon: Globe2,
      title: 'GeoPolicy Insights',
      description: 'Explore geospatial contamination patterns with heat maps, policy recommendations, and district-wise compliance reports.',
      color: 'from-orange-500 to-red-500',
      action: 'geospatial'
    },
  ];

  const stats = [
    { label: 'Contaminant Records', value: '1,036', icon: FlaskConical, trend: '+12%', color: 'bg-blue-500' },
    { label: 'Zones Covered', value: '38', icon: MapPin, trend: '+5', color: 'bg-green-500' },
    { label: 'Source Points', value: '183', icon: Droplets, trend: '+8%', color: 'bg-orange-500' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMC0xMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse"></div>
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Ministry of Jal Shakti Initiative</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Revolutionary Heavy Metal Detection System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-50 leading-relaxed">
              Real-time monitoring, AI-powered analysis, and geospatial intelligence for safeguarding India's groundwater from heavy metal contamination.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => onSectionChange('upload')}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-6 text-lg shadow-2xl transition-all duration-300"
              >
                <Database className="h-5 w-5 mr-2" />
                Upload Sample Data
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onSectionChange('connect')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-6 text-lg backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-8 w-8" />
            <h2 className="text-3xl font-bold">India's Premier Heavy Metal Detection Platform</h2>
          </div>
          <p className="text-lg text-blue-50 max-w-4xl leading-relaxed">
            Empowering environmental scientists, researchers, and policymakers with cutting-edge tools to detect, analyze, and mitigate heavy metal contamination in groundwater across India. Combining IoT integration, AI-powered analytics, and geospatial intelligence for a safer tomorrow.
          </p>
        </div>
      </section>

      {/* Platform Features - Redesigned */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            <span className="font-semibold text-sm">Explore Platform Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Complete Water Safety Toolkit</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Four powerful modules working together to provide end-to-end heavy metal contamination management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:shadow-xl group cursor-pointer overflow-hidden"
                onClick={() => onSectionChange(feature.action)}
              >
                <CardHeader>
                  <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground group-hover:text-blue-50 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:text-white font-medium text-sm group-hover:translate-x-2 transition-transform">
                    <span>Explore Now</span>
                    <TrendingUp className="h-4 w-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats with Visual Enhancement */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-2xl font-bold mb-6 text-center">Real-Time Impact Metrics</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-muted-foreground group-hover:text-blue-100 text-sm font-medium">{stat.label}</p>
                      <p className="text-4xl font-bold mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:text-white group-hover:bg-none">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} group-hover:bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-md transition-colors`}>
                      <Icon className="h-6 w-6 text-white group-hover:text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600 group-hover:text-green-200 bg-green-50 group-hover:bg-white/20 px-3 py-1 rounded-full w-fit transition-colors">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-semibold">{stat.trend} this month</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-none shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  Begin Your Heavy Metal Analysis Journey
                </h3>
                <p className="text-white/90 max-w-2xl text-lg leading-relaxed">
                  Upload water sample data, connect detection devices, or explore geospatial contamination patterns. Get started with India's most comprehensive heavy metal monitoring system.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={() => onSectionChange('upload')}
                  className="whitespace-nowrap bg-pink-500 text-white hover:bg-pink-400 font-semibold shadow-xl px-8 py-6 text-lg border-2 border-pink-400 transition-all duration-300"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Sample Data
                </Button>
                <Button
                  size="lg"
                  onClick={() => onSectionChange('connect')}
                  className="whitespace-nowrap bg-indigo-500 text-white hover:bg-indigo-400 font-semibold px-8 border-2 border-indigo-400 transition-all duration-300"
                >
                  <Command className="h-5 w-5 mr-2" />
                  Connect Device
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Partner Logos with Navigation */}
      <section className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-r from-white via-blue-50 to-white p-8 shadow-lg">
          {/* Left Arrow */}
          <button
            onClick={prevLogo}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Previous partner"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextLogo}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Next partner"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Partners Display */}
          <div className="flex justify-center items-center gap-8 px-16">
            {[0, 1, 2].map((offset) => {
              const index = (currentLogoIndex + offset) % totalPartners;
              return (
                <div
                  key={offset}
                  className="flex-shrink-0 w-32 h-20 flex items-center justify-center bg-white rounded-xl shadow-md border border-slate-100 transition-all duration-300"
                >
                  <div className="text-slate-400 font-bold text-xs">PARTNER {index + 1}</div>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPartners }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentLogoIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentLogoIndex ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to partner ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;