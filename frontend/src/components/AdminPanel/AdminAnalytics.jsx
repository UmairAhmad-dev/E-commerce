import { useState, useEffect } from "react";
import "./Admin.css";

const AdminAnalytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const fetchLiveAnalytics = async () => {
    const token = localStorage.getItem('auth-token');
    try {
      setLoading(true);
      setConnectionError(false);
      
      const res = await fetch("http://localhost:4000/api/analytics/dashboard", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (data.success && data.metrics) {
        setMetrics(data.metrics);
      } else {
        console.error("Backend validation failed, applying visual placeholder matrix layout.");
        setConnectionError(true);
        useFallbackMetrics();
      }
    } catch (error) {
      console.error("Server connection timeout mapping pipeline, applying visual placeholder matrix layout.", error);
      setConnectionError(true);
      useFallbackMetrics();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackMetrics = () => {
    setMetrics({
      totalRevenue: 12450.00, totalOrders: 184, totalProducts: 38, totalUsers: 42,
      distribution: { men: 15, women: 18, kid: 5 }
    });
  };

  useEffect(() => { fetchLiveAnalytics(); }, []);

  if (loading) {
    return <div className="admin-component-wireframe-loader">Computing live performance charts...</div>;
  }

  const currentMetrics = metrics || {
    totalRevenue: 0, totalOrders: 0, totalProducts: 1, totalUsers: 0, distribution: { men: 0, women: 0, kid: 0 }
  };

  const totalItems = currentMetrics.totalProducts || 1;
  const menCount = currentMetrics.distribution?.men || 0;
  const womenCount = currentMetrics.distribution?.women || 0;
  const kidCount = currentMetrics.distribution?.kid || 0;

  const menPercentage = ((menCount / totalItems) * 100).toFixed(1);
  const womenPercentage = ((womenCount / totalItems) * 100).toFixed(1);
  const kidPercentage = ((kidCount / totalItems) * 100).toFixed(1);

  return (
    <div className="analytics-grid animated-fade">
      
      {connectionError && (
        <div style={{ gridColumn: 'span 3', padding: '12px 16px', background: '#fff7ed', color: '#c2410c', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #ffedd5' }}>
          ⚠️ Notice: Offline connection fallback mode active. Displaying mock visualization parameters.
        </div>
      )}
      
      <div className="metric-card premium-ui-card">
        <div className="metric-icon revenue-bg">💰</div>
        <div className="metric-info">
          <span>Gross Retail Income</span>
          {/* 🚀 Changed from $ to Rs. */}
          <h3>Rs. {currentMetrics.totalRevenue ? currentMetrics.totalRevenue.toLocaleString('en-PK') : "0"}</h3>
          <span className="trend-indicator positive">✨ Active Pipeline</span>
        </div>
      </div>

      <div className="metric-card premium-ui-card">
        <div className="metric-icon dispatch-bg">📦</div>
        <div className="metric-info">
          <span>Items Dispatched</span>
          <h3>{currentMetrics.totalOrders || 0} Units</h3>
          <span className="trend-indicator positive">🚚 Full Volume</span>
        </div>
      </div>

      <div className="metric-card premium-ui-card">
        <div className="metric-icon users-bg">👥</div>
        <div className="metric-info">
          <span>Registered Customers</span>
          <h3>{currentMetrics.totalUsers || 0} Accounts</h3>
          <span className="trend-indicator positive">👤 Active Indexes</span>
        </div>
      </div>

      <div className="analytics-chart-mockup premium-ui-card">
        <div className="chart-header-row">
          <div>
            <h3>Inventory Stock Category Allocation</h3>
            <p className="chart-subtitle">Real-time categorical balance ratio mappings inside server segments</p>
          </div>
          <span className="total-inventory-badge">Total SKUs: {totalItems}</span>
        </div>
        
        <div className="category-distribution-bars-stack">
          <div className="distribution-bar-row">
            <div className="bar-labels">
              <span>Men's Apparel ({menCount} products)</span>
              <strong>{menPercentage}%</strong>
            </div>
            <div className="bar-track-base">
              <div className="bar-fill-indicator color-men" style={{ width: `${menPercentage}%` }}></div>
            </div>
          </div>

          <div className="distribution-bar-row">
            <div className="bar-labels">
              <span>Women's Fashion ({womenCount} products)</span>
              <strong>{womenPercentage}%</strong>
            </div>
            <div className="bar-track-base">
              <div className="bar-fill-indicator color-women" style={{ width: `${womenPercentage}%` }}></div>
            </div>
          </div>

          <div className="distribution-bar-row">
            <div className="bar-labels">
              <span>Kids & Toddler Apparel ({kidCount} products)</span>
              <strong>{kidPercentage}%</strong>
            </div>
            <div className="bar-track-base">
              <div className="bar-fill-indicator color-kids" style={{ width: `${kidPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;