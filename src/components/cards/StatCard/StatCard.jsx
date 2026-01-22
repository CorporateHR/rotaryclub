import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, className = '' }) => {
  return (
    <div className={`${styles.statCard} ${className}`}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.title}>{title}</div>
      </div>
    </div>
  );
};

export default StatCard;

