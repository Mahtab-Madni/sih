import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Map from "./pages/Map";
import ConnectDevice from './components/ConnectDevice';
import GeospatialPolicyDashboard from "./components/GeospatialPolicyDashboard";
import { HomeCard } from "./components/Results";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { LanguageProvider } from "./contexts/LanguageContext";
import MapView from "./components/MapView";

const queryClient = new QueryClient();

const App = () => (
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="flex flex-col min-h-screen">
            <BrowserRouter>
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  {/* <Route path="/connect-device" element={<ConnectDevice />} /> */}
                  {<Route path="/map" element={<MapView/> } />}
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </I18nextProvider>
);

export default App;