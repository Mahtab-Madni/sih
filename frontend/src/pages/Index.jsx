import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DataUpload from '@/components/DataUpload';
import ConnectDevice from '@/components/ConnectDevice';
import Results from '@/components/Results';
import GeospatialPolicyDashboard from '@/components/GeospatialPolicyDashboard';
import Footer from '@/components/Footer';
import MapView from '@/components/MapView';
import "./chatbot.css";

const Index = ({ defaultSection = 'home' }) => {
  const [activeSection, setActiveSection] = useState(defaultSection);
  const [uploadedData, setUploadedData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleDataUpload = (data) => {
    setUploadedData(data);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'upload':
        return (
          <>
            <DataUpload
              onDataUpload={handleDataUpload}
              onSectionChange={setActiveSection}
            />
            <div className="chatbot-container">
              <button
          onClick={() => setIsOpen(!isOpen)}
          className={`chatbot-button ${isOpen ? 'small' : ''}`}
              >
          {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
          <div className="chatbot-iframe">
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
              width="100%"
              height="100%"
              style={{ minHeight: "650px" }}
            ></iframe>
          </div>
              )}
            </div>
          </>
        );
      case 'connect': // 👈 Add this new case
        return (
          <>
            <ConnectDevice />
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-button ${isOpen ? "small" : ""}`}
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "650px" }}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
      case 'results':
        return (
          <>
            <Results setActiveSection={setActiveSection}/>
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-button ${isOpen ? 'small' : ''}`}
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "650px" }}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
      case 'geospatial':
        return (
          <>
            <GeospatialPolicyDashboard />
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-button ${isOpen ? 'small' : ''}`}
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "650px" }}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );
      case 'home':
        return (
          <>
            <Dashboard onSectionChange={setActiveSection} />;
            <div className="chatbot-container">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-button ${isOpen ? 'small' : ''}`}
              >
                {isOpen ? "✖" : "💬"}
              </button>
              {isOpen && (
                <div className="chatbot-iframe">
                  <iframe
                    src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                    width="100%"
                    height="100%"
                    style={{ minHeight: "650px" }}
                  ></iframe>
                </div>
              )}
            </div>
          </>
        );  
      case 'map': // 🔹 Added map case
        return <MapView />;
      case 'contact':
      return (
        <>
          <div
            style={{
              maxWidth: "900px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* Contact Information */}
            <div
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                margin: "1.5rem",
              }}
            >
              <h1
                style={{
                  color: "darkblue",
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  marginBottom: "1.5rem",
                }}
              >
                Contact Information
              </h1>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2rem",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    Ministry of Jal Shakti
                  </h3>
                  <p>Department of Water Resources</p>
                  <p>Government of India</p>
                  <p>New Delhi - 110001</p>
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                    }}
                  >
                    Technical Support
                  </h3>
                  <p>Email: support@aqualyx.gov.in</p>
                  <p>Phone: 1800-XXX-XXXX</p>
                  <p>Hours: 9:00 AM - 6:00 PM (Mon-Fri)</p>
                </div>
              </div>
            </div>

            {/* File a Report Section */}
            <div
              style={{
                color: "#1e40af",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0px 6px 14px rgba(0,0,0,0.25)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "1.5rem",
                }}
              >
                File a Report
              </h2>
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      color: "#0a2540",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      color: "#0a2540",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label style={{ fontWeight: "600" }}>Report Details</label>
                  <textarea
                    rows="4"
                    placeholder="Describe the issue..."
                    style={{
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      outline: "none",
                      fontSize: "1rem",
                      color: "#0a2540",
                    }}
                  ></textarea>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="submit"
                    style={{
                      background: "#1e40af",
                      color: "#fff",
                      fontWeight: "600",
                      padding: "0.6rem 1.5rem",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    Submit Report
                  </button>
                  <button
                    type="reset"
                    style={{
                      background: "transparent",
                      border: "2px solid black",
                      color: "black",
                      fontWeight: "600",
                      padding: "0.6rem 1.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="chatbot-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`chatbot-button ${isOpen ? "small" : ""}`}
            >
              {isOpen ? "✖" : "💬"}
            </button>
            {isOpen && (
              <div className="chatbot-iframe">
                <iframe
                  src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                  width="100%"
                  height="100%"
                  style={{ minHeight: "650px" }}
                ></iframe>
              </div>
            )}
          </div>
        </>
      );
    default:
      return (
        <>
          <Dashboard onSectionChange={setActiveSection} />;
          <div className="chatbot-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`chatbot-button ${isOpen ? 'small' : ''}`}
            >
              {isOpen ? "✖" : "💬"}
            </button>
            {isOpen && (
              <div className="chatbot-iframe">
                <iframe
                  src="https://www.chatbase.co/chatbot-iframe/KA56N8LUWvaDb9aw3UIdx"
                  width="100%"
                  height="100%"
                  style={{ minHeight: "650px" }}
                ></iframe>
              </div>
            )}
          </div>
        </>
      );
    }
  };

return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;