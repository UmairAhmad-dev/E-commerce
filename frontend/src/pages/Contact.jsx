import React from 'react';

const Contact = () => {
  return (
    <div style={{ 
      padding: "120px 6% 140px 6%", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      minHeight: "60vh", 
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
        COMMUNICATION MESH
      </span>
      <h1 style={{ 
        fontSize: "44px", 
        fontWeight: "900", 
        letterSpacing: "-1.5px", 
        marginBottom: "36px", 
        color: "#0f172a" 
      }}>
        Contact Corporate Support
      </h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "24px", 
        marginTop: "20px" 
      }}>
        {[
          { label: "📍 Corporate Head Office", val: "Islamabad, Pakistan" },
          { label: "📞 Support Hotline", val: "+92 (21) 111-SHOPPER (746-773)" },
          { label: "✉️ Email Address", val: "care@shopper.pk" }
        ].map((info, idx) => (
          <div key={idx} style={{ 
            padding: "24px 28px", 
            background: "#f8fafc", 
            border: "1px solid #e2e8f0", 
            borderRadius: "16px",
            boxShadow: "0 10px 25px -15px rgba(15, 23, 42, 0.02)"
          }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {info.label.split(": ")[0]}
            </h4>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#0f172a" }}>
              {info.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;