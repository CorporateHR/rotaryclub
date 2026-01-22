import { useState } from 'react';
import { FiBarChart2, FiDownload, FiFileText } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import FilterChips from '../../../components/common/FilterChips/FilterChips';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import styles from './Analytics.module.css';

const AdminAnalytics = () => {
  const [timeFilter, setTimeFilter] = useState('thisMonth');

  const timeOptions = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'allTime', label: 'All Time' },
  ];

  return (
    <div className={styles.analyticsPage}>
      <Header currentView="admin" />
      <div className={styles.container}>
        <h1 className={styles.title}>Analytics</h1>

        <FilterChips options={timeOptions} selected={timeFilter} onChange={setTimeFilter} />

        <Card className={styles.chartCard}>
          <h2 className={styles.cardTitle}>Meeting Attendance</h2>
          <div className={styles.chartPlaceholder}>
            <FiBarChart2 className={styles.chartIcon} />
            <p>Chart visualization would appear here</p>
            <p className={styles.chartNote}>Current month average: 85%</p>
          </div>
        </Card>

        <div className={styles.tablesGrid}>
          <Card className={styles.tableCard}>
            <h2 className={styles.cardTitle}>Top Members by Attendance</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Sarah Anderson</td><td>100%</td></tr>
                <tr><td>2</td><td>Michael Johnson</td><td>95%</td></tr>
                <tr><td>3</td><td>Lisa Chen</td><td>88%</td></tr>
                <tr><td>4</td><td>John Doe</td><td>92%</td></tr>
                <tr><td>5</td><td>Emily Williams</td><td>85%</td></tr>
              </tbody>
            </table>
          </Card>

          <Card className={styles.tableCard}>
            <h2 className={styles.cardTitle}>Top Volunteers by Hours</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Hours</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1</td><td>Emily Williams</td><td>42.5</td></tr>
                <tr><td>2</td><td>Sarah Anderson</td><td>38.0</td></tr>
                <tr><td>3</td><td>Lisa Chen</td><td>35.0</td></tr>
                <tr><td>4</td><td>David Brown</td><td>31.5</td></tr>
                <tr><td>5</td><td>Michael Johnson</td><td>28.0</td></tr>
              </tbody>
            </table>
          </Card>
        </div>

        <Card className={styles.metricsCard}>
          <h2 className={styles.cardTitle}>Volunteer Event Success Metrics</h2>
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Total Events</span>
              <span className={styles.metricValue}>12</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Total Hours</span>
              <span className={styles.metricValue}>387</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Avg Volunteers/Event</span>
              <span className={styles.metricValue}>18.5</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Fill Rate</span>
              <span className={styles.metricValue}>92%</span>
            </div>
          </div>
        </Card>

        <div className={styles.exportActions}>
          <Button variant="secondary" onClick={() => {}}>
            <FiDownload /> Export PDF
          </Button>
          <Button variant="secondary" onClick={() => {}}>
            <FiFileText /> Excel Report
          </Button>
        </div>
      </div>
      <BottomNav type="admin" />
    </div>
  );
};

export default AdminAnalytics;

