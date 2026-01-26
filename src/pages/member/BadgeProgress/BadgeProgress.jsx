import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { getBadgeRequirements, getMemberBadgeProgress, getProgressPercentage, updateRequirementStatus } from '../../../data/badgeData';
import { FiArrowLeft, FiAward, FiCheck, FiCircle } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Badge from '../../../components/common/Badge/Badge';
import styles from './BadgeProgress.module.css';

const BadgeProgress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requirements, setRequirements] = useState([]);
  const [progress, setProgress] = useState(null);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (!user) return;

    const reqs = getBadgeRequirements();
    const prog = getMemberBadgeProgress(user.id);
    const pct = getProgressPercentage(user.id);

    setRequirements(reqs);
    setProgress(prog);
    setPercentage(pct);
  }, [user]);

  const handleToggleRequirement = (requirementId) => {
    if (!user) return;

    const isCompleted = progress.completedRequirements.includes(requirementId);
    const updatedProgress = updateRequirementStatus(user.id, requirementId, !isCompleted);
    
    setProgress(updatedProgress);
    setPercentage(getProgressPercentage(user.id));
  };

  if (!user || !progress) {
    return <div>Loading...</div>;
  }

  const categoryGroups = {
    meetings: [],
    events: [],
    orientation: [],
    participation: [],
    duties: [],
    protocol: [],
    administrative: [],
    training: [],
    completion: [],
  };

  requirements.forEach(req => {
    if (categoryGroups[req.category]) {
      categoryGroups[req.category].push(req);
    }
  });

  const categoryLabels = {
    meetings: 'Meetings',
    events: 'Events',
    orientation: 'Orientation',
    participation: 'Participation',
    duties: 'Duties & Responsibilities',
    protocol: 'Rotary Protocol',
    administrative: 'Administrative',
    training: 'Training',
    completion: 'Badge Award',
  };

  return (
    <div className={styles.badgePage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/member/profile')}>
          <FiArrowLeft /> Back to Profile
        </button>

        <div className={styles.header}>
          <div className={styles.badgeIcon} style={{ backgroundColor: progress.badgeColor }}>
            <FiAward />
          </div>
          <h1 className={styles.title}>Badge Progress</h1>
          <p className={styles.subtitle}>
            {progress.currentBadge === 'red' 
              ? 'Complete all requirements to earn your Blue Badge'
              : 'Congratulations! You have earned your Blue Badge'}
          </p>
        </div>

        <Card className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <div className={styles.badgeStatus}>
              <span className={styles.currentBadgeLabel}>Current Badge:</span>
              <Badge 
                variant={progress.currentBadge === 'blue' ? 'info' : 'danger'}
                className={styles.badgeBadge}
              >
                {progress.currentBadge === 'red' ? '🔴 Red Badge' : '🔵 Blue Badge'}
              </Badge>
            </div>
            {progress.dateCompleted && (
              <span className={styles.completionDate}>
                Completed: {new Date(progress.dateCompleted).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarWrapper}>
              <div 
                className={styles.progressBarFill} 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: progress.currentBadge === 'blue' ? '#4A90E2' : '#E74C3C'
                }}
              />
            </div>
            <span className={styles.progressPercentage}>{percentage}%</span>
          </div>

          <div className={styles.progressStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{progress.completedRequirements.length}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statDivider}>/</div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{requirements.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>
        </Card>

        <div className={styles.requirementsSection}>
          <h2 className={styles.sectionTitle}>Red to Blue Badge Requirements</h2>
          <p className={styles.sectionDescription}>
            Complete all tasks below to progress from Red Badge to Blue Badge status
          </p>

          {Object.entries(categoryGroups).map(([category, reqs]) => {
            if (reqs.length === 0) return null;

            return (
              <div key={category} className={styles.categorySection}>
                <h3 className={styles.categoryTitle}>{categoryLabels[category]}</h3>
                <div className={styles.requirementsList}>
                  {reqs.map((req) => {
                    const isCompleted = progress.completedRequirements.includes(req.id);
                    
                    return (
                      <div 
                        key={req.id} 
                        className={`${styles.requirementItem} ${isCompleted ? styles.completed : ''}`}
                        onClick={() => handleToggleRequirement(req.id)}
                      >
                        <div className={styles.requirementCheckbox}>
                          {isCompleted ? (
                            <div className={styles.checkboxChecked}>
                              <FiCheck />
                            </div>
                          ) : (
                            <div className={styles.checkboxUnchecked}>
                              <FiCircle />
                            </div>
                          )}
                        </div>
                        <div className={styles.requirementContent}>
                          <div className={styles.requirementHeader}>
                            <span className={styles.requirementNumber}>#{req.id}</span>
                            <h4 className={styles.requirementTitle}>{req.title}</h4>
                          </div>
                          <p className={styles.requirementDescription}>{req.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {progress.currentBadge === 'blue' && (
          <Card className={styles.congratsCard}>
            <div className={styles.congratsContent}>
              <div className={styles.congratsIcon}>🎉</div>
              <h3 className={styles.congratsTitle}>Congratulations!</h3>
              <p className={styles.congratsText}>
                You have successfully completed all requirements and earned your Blue Badge.
                Your dedication to Rotary and service above self is commendable!
              </p>
            </div>
          </Card>
        )}
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default BadgeProgress;
