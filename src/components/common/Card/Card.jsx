import styles from './Card.module.css';

const Card = ({ children, className = '', header, ...props }) => {
  return (
    <div className={`${styles.card} ${className}`} {...props}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Card;

