const AdminAnalytics = () => {
  return (
    <div className="analytics-grid animated-fade">
      
      {/* CARD 1: REVENUE WIDGET */}
      <div className="metric-card premium-ui-card">
        <div className="metric-icon revenue-bg">💰</div>
        <div className="metric-info">
          <span>Gross Retail Income</span>
          <h3>$12,450.00</h3>
          <span className="trend-indicator positive">↑ +14.2% <small>this week</small></span>
        </div>
      </div>

      {/* CARD 2: SHIPMENT WIDGET */}
      <div className="metric-card premium-ui-card">
        <div className="metric-icon dispatch-bg">📦</div>
        <div className="metric-info">
          <span>Items Dispatched</span>
          <h3>184 units</h3>
          <span className="trend-indicator positive">↑ +8.5% <small>this week</small></span>
        </div>
      </div>

      {/* CARD 3: ACCOUNTS WIDGET */}
      <div className="metric-card premium-ui-card">
        <div className="metric-icon users-bg">👥</div>
        <div className="metric-info">
          <span>New Registrations</span>
          <h3>42 accounts</h3>
          <span className="trend-indicator negative">↓ -2.1% <small>vs last month</small></span>
        </div>
      </div>

      {/* PREMIUM UPGRADED GRAPH CONTAINER */}
      <div className="analytics-chart-mockup premium-ui-card">
        <div className="chart-header-row">
          <div>
            <h3>Weekly Sales Trajectory</h3>
            <p className="chart-subtitle">Real-time performance distribution analysis</p>
          </div>
          <div className="chart-legend-pills">
            <span className="legend-pill line-item">Target</span>
            <span className="legend-pill revenue-accent">Actual Revenue</span>
          </div>
        </div>
        
        <div className="bar-chart-wrapper">
          <div className="chart-bar" style={{height: '42%'}} data-day="Mon"><span className="bar-tooltip">$1.2k</span></div>
          <div className="chart-bar" style={{height: '65%'}} data-day="Tue"><span className="bar-tooltip">$2.1k</span></div>
          <div className="chart-bar" style={{height: '85%'}} data-day="Wed"><span className="bar-tooltip">$3.4k</span></div>
          <div className="chart-bar" style={{height: '50%'}} data-day="Thu"><span className="bar-tooltip">$1.9k</span></div>
          <div className="chart-bar" style={{height: '95%'}} data-day="Fri"><span className="bar-tooltip">$4.2k</span></div>
          <div className="chart-bar active" style={{height: '75%'}} data-day="Sat"><span className="bar-tooltip">$3.1k</span></div>
          <div className="chart-bar" style={{height: '60%'}} data-day="Sun"><span className="bar-tooltip">$2.5k</span></div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;