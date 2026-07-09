const AdminAnalytics = () => {
  return (
    <div className="analytics-grid animated-fade">
      <div className="metric-card">
        <div className="metric-icon">💰</div>
        <div className="metric-info">
          <span>Gross Retail Income</span>
          <h3>$12,450.00</h3>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon">📦</div>
        <div className="metric-info">
          <span>Items Dispatched</span>
          <h3>184 units</h3>
        </div>
      </div>
      <div className="metric-card">
        <div className="metric-icon">👥</div>
        <div className="metric-info">
          <span>New Registrations</span>
          <h3>42 accounts</h3>
        </div>
      </div>

      <div className="analytics-chart-mockup">
        <h3>Weekly Sales Trajectory (Simulation)</h3>
        <div className="bar-chart-wrapper">
          <div className="chart-bar" style={{height: '40%'}} data-day="Mon"></div>
          <div className="chart-bar" style={{height: '65%'}} data-day="Tue"></div>
          <div className="chart-bar" style={{height: '85%'}} data-day="Wed"></div>
          <div className="chart-bar" style={{height: '50%'}} data-day="Thu"></div>
          <div className="chart-bar" style={{height: '95%'}} data-day="Fri"></div>
          <div className="chart-bar active" style={{height: '70%'}} data-day="Sat"></div>
          <div className="chart-bar" style={{height: '60%'}} data-day="Sun"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;