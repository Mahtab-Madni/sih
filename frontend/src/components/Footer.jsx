import React from 'react';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: "#1e40af", 
      color: "white", 
      padding: "1.5rem 1rem", 
      width: "100%",
      marginTop: "1.5rem"
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "2rem" }}>
          <div style={{ flex: "1" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>USEFUL LINKS</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a href="#" style={{ color: "white" }}>Archives</a>
                <a href="#" style={{ color: "white" }}>Website Policies</a>
                <a href="#" style={{ color: "white" }}>Help</a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a href="#" style={{ color: "white" }}>Contact Us</a>
                <a href="#" style={{ color: "white" }}>Feedback</a>
                <a href="#" style={{ color: "white" }}>Web Information Manager</a>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <a href="#" style={{ color: "white" }}>Terms & Conditions</a>
                <a href="#" style={{ color: "white" }}>Privacy Policy</a>
                <a href="#" style={{ color: "white" }}>Copyright Policy</a>
              </div>
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", minWidth: "250px" }}>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase" }}>SUBSCRIBE FOR UPDATES</div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <a href="#" aria-label="Twitter" style={{ color: "white" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" aria-label="YouTube" style={{ color: "white" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" style={{ color: "white" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" style={{ color: "white" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <img src="/logo-JalShakti.png" alt="Jal Shakti Logo" style={{ backgroundColor: "white", height: "2rem" }} />
              <img src="/Swach-Bharat_Preview.png" alt="Swachh Bharat Logo" style={{ height: "2rem" }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: "1rem", fontSize: "0.75rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "0.5rem" }}>
          This Website belongs to Department of Water Resources, River Development and Ganga Rejuvenation;
          <span style={{ float: "right" }}>Last Updated On: 01.10.2025</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;