import React from 'react';

const About = () => {
  return (
    <div style={{ 
      padding: "120px 6% 140px 6%", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      minHeight: "60vh", 
      lineHeight: "1.85", 
      fontFamily: "system-ui, -apple-system, sans-serif" 
    }}>
      <span style={{ 
        display: "block", 
        fontSize: "11px", 
        fontWeight: "800", 
        letterSpacing: "3px", 
        color: "#ff4141", 
        textTransform: "uppercase", 
        marginBottom: "12px" 
      }}>
        OUR IDENTITY ARCHIVE
      </span>
      <h1 style={{ 
        fontSize: "44px", 
        fontWeight: "900", 
        letterSpacing: "-1.5px", 
        marginBottom: "28px", 
        color: "#0f172a" 
      }}>
        About SHOPPER
      </h1>
      <p style={{ 
        color: "#475569", 
        fontSize: "16.5px", 
        maxWidth: "800px", 
        textAlign: "justify" 
      }}>
        Founded with a sharp vision to celebrate heritage textiles, SHOPPER brings premium stitched collections 
        directly to your doorstep. We work closely alongside highly skilled local artisans to deliver breathable, 
        high-quality lawn, silk, and festive traditional ensembles that honor historical weaving patterns 
        while fitting seamlessly into modern wardrobes.
      </p>
    </div>
  );
};

export default About;