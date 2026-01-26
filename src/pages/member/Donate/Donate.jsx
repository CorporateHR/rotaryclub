import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDonationFoundations } from '../../../data/donationData';
import { FiArrowLeft, FiCopy, FiCheck, FiHeart } from 'react-icons/fi';
import Header from '../../../components/navigation/Header/Header';
import BottomNav from '../../../components/navigation/BottomNav/BottomNav';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import { QRCodeSVG } from 'qrcode.react';
import styles from './Donate.module.css';

const Donate = () => {
  const navigate = useNavigate();
  const foundations = getDonationFoundations();
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className={styles.donatePage}>
      <Header currentView="member" />
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate('/member/home')}>
          <FiArrowLeft /> Back to Home
        </button>

        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <FiHeart />
          </div>
          <h1 className={styles.title}>Make a Donation</h1>
          <p className={styles.subtitle}>
            Support Rotary's mission to create lasting change in communities worldwide
          </p>
        </div>

        {foundations.map((foundation) => (
          <Card key={foundation.id} className={styles.foundationCard}>
            <div className={styles.foundationHeader}>
              <div className={styles.foundationLogo}>{foundation.logo}</div>
              <div className={styles.foundationInfo}>
                <h2 className={styles.foundationName}>{foundation.name}</h2>
                <p className={styles.foundationDescription}>{foundation.description}</p>
              </div>
            </div>

            <div className={styles.causesSection}>
              <h3 className={styles.sectionTitle}>Your donation supports:</h3>
              <ul className={styles.causesList}>
                {foundation.causes.map((cause, index) => (
                  <li key={index} className={styles.causeItem}>
                    <span className={styles.causeIcon}>✓</span>
                    {cause}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.paymentSection}>
              <h3 className={styles.sectionTitle}>Payment Options</h3>
              
              <div className={styles.paymentMethods}>
                <div className={styles.qrSection}>
                  <h4 className={styles.methodTitle}>Scan QR Code to Pay</h4>
                  <div className={styles.qrCodeWrapper}>
                    <QRCodeSVG
                      value={foundation.qrCode}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  {foundation.upiId && (
                    <div className={styles.upiInfo}>
                      <span className={styles.upiLabel}>UPI ID:</span>
                      <div className={styles.copyField}>
                        <span className={styles.upiId}>{foundation.upiId}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.upiId, `upi-${foundation.id}`)}
                        >
                          {copiedField === `upi-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.bankSection}>
                  <h4 className={styles.methodTitle}>Bank Transfer Details</h4>
                  <div className={styles.bankDetails}>
                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>Account Name:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.accountName}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.accountName, `accName-${foundation.id}`)}
                        >
                          {copiedField === `accName-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>Account Number:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.accountNumber}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.accountNumber, `accNum-${foundation.id}`)}
                        >
                          {copiedField === `accNum-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>Bank Name:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.bankName}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.bankName, `bank-${foundation.id}`)}
                        >
                          {copiedField === `bank-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>IFSC Code:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.ifscCode}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.ifscCode, `ifsc-${foundation.id}`)}
                        >
                          {copiedField === `ifsc-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>SWIFT Code:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.swiftCode}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.swiftCode, `swift-${foundation.id}`)}
                        >
                          {copiedField === `swift-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.bankDetailItem}>
                      <span className={styles.bankLabel}>Branch:</span>
                      <div className={styles.copyField}>
                        <span className={styles.bankValue}>{foundation.bankDetails.branch}</span>
                        <button
                          className={styles.copyButton}
                          onClick={() => copyToClipboard(foundation.bankDetails.branch, `branch-${foundation.id}`)}
                        >
                          {copiedField === `branch-${foundation.id}` ? <FiCheck /> : <FiCopy />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className={styles.thankYouSection}>
          <FiHeart className={styles.thankYouIcon} />
          <h3 className={styles.thankYouTitle}>Thank You for Your Generosity!</h3>
          <p className={styles.thankYouText}>
            Every donation makes a difference in creating positive change in our communities.
            Your support helps us continue our mission of service above self.
          </p>
        </div>
      </div>
      <BottomNav type="member" />
    </div>
  );
};

export default Donate;
