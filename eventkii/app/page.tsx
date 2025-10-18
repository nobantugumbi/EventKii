"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const features = [
    {
      name: "Create Events",
      description: "Launch your event with blockchain-secured tickets",
      action: "create-event",
      icon: "🎪",
    },
    {
      name: "Mint Tickets",
      description: "Generate unique NFT tickets for attendees",
      action: "mint-tickets",
      icon: "🎫",
    },
    {
      name: "My Tickets",
      description: "View and manage your owned tickets",
      action: "my-tickets",
      icon: "🎟️",
    },
    {
      name: "Verify Access",
      description: "Instant ticket validation at event entry",
      action: "verify-access",
      icon: "✅",
    },
    {
      name: "Transfer Tickets",
      description: "Secure peer-to-peer ticket transfers",
      action: "transfer-tickets",
      icon: "🔄",
    },
    {
      name: "Event Analytics",
      description: "Real-time insights and attendance tracking",
      action: "event-analytics",
      icon: "📊",
    },
  ];

  const handleFeatureClick = (action: string) => {
    setActiveModal(action);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const feature = features.find(f => f.action === activeModal);
    if (!feature) return null;

    return (
      <div className={styles.modalOverlay} onClick={closeModal}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>{feature.icon} {feature.name}</h2>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
          </div>
          <div className={styles.modalContent}>
            {renderModalContent(activeModal)}
          </div>
        </div>
      </div>
    );
  };

  const renderModalContent = (action: string) => {
    switch (action) {
      case "create-event":
        return (
          <div className={styles.formContainer}>
            <h3>Create New Event</h3>
            <form className={styles.eventForm}>
              <div className={styles.formGroup}>
                <label>Event Name</label>
                <input type="text" placeholder="Enter event name" />
              </div>
              <div className={styles.formGroup}>
                <label>Date & Time</label>
                <input type="datetime-local" />
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input type="text" placeholder="Event venue or address" />
              </div>
              <div className={styles.formGroup}>
                <label>Ticket Price (ETH)</label>
                <input type="number" step="0.001" placeholder="0.05" />
              </div>
              <div className={styles.formGroup}>
                <label>Total Tickets</label>
                <input type="number" placeholder="100" />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea placeholder="Event description..." rows={4}></textarea>
              </div>
              <button type="submit" className={styles.primaryButton}>
                Create Event on Blockchain
              </button>
            </form>
          </div>
        );

      case "mint-tickets":
        return (
          <div className={styles.formContainer}>
            <h3>Mint Event Tickets</h3>
            <div className={styles.ticketMinting}>
              <div className={styles.eventSelector}>
                <label>Select Event</label>
                <select>
                  <option>Tech Conference 2024</option>
                  <option>Music Festival</option>
                  <option>Art Exhibition</option>
                </select>
              </div>
              <div className={styles.mintingInfo}>
                <div className={styles.infoCard}>
                  <h4>Event Details</h4>
                  <p><strong>Name:</strong> Tech Conference 2024</p>
                  <p><strong>Date:</strong> March 15, 2024</p>
                  <p><strong>Price:</strong> 0.05 ETH</p>
                  <p><strong>Available:</strong> 87/100 tickets</p>
                </div>
              </div>
              <div className={styles.mintControls}>
                <label>Number of Tickets to Mint</label>
                <input type="number" min="1" max="10" defaultValue="1" />
                <button className={styles.primaryButton}>
                  Mint Tickets (0.05 ETH)
                </button>
              </div>
            </div>
          </div>
        );

      case "verify-access":
        return (
          <div className={styles.formContainer}>
            <h3>Verify Ticket Access</h3>
            <div className={styles.verificationContainer}>
              <div className={styles.qrScanner}>
                <div className={styles.scannerPlaceholder}>
                  <div className={styles.scannerFrame}>
                    <div className={styles.scannerCorners}></div>
                    <p>📱 QR Code Scanner</p>
                    <p>Point camera at ticket QR code</p>
                  </div>
                </div>
                <button className={styles.primaryButton}>
                  Start Camera Scanner
                </button>
              </div>
              <div className={styles.manualVerify}>
                <h4>Manual Verification</h4>
                <input type="text" placeholder="Enter ticket ID or wallet address" />
                <button className={styles.secondaryButton}>
                  Verify Manually
                </button>
              </div>
              <div className={styles.verificationResult}>
                <div className={styles.resultCard}>
                  <h4>✅ Verification Result</h4>
                  <p><strong>Status:</strong> Valid Ticket</p>
                  <p><strong>Event:</strong> Tech Conference 2024</p>
                  <p><strong>Holder:</strong> 0x1234...5678</p>
                  <p><strong>Seat:</strong> A-15</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "transfer-tickets":
        return (
          <div className={styles.formContainer}>
            <h3>Transfer Tickets</h3>
            <div className={styles.transferContainer}>
              <div className={styles.myTickets}>
                <h4>My Tickets</h4>
                <div className={styles.ticketList}>
                  <div className={styles.ticketCard}>
                    <h5>Tech Conference 2024</h5>
                    <p>Seat: A-15 | March 15, 2024</p>
                    <button className={styles.selectButton}>Select</button>
                  </div>
                  <div className={styles.ticketCard}>
                    <h5>Music Festival</h5>
                    <p>General Admission | April 20, 2024</p>
                    <button className={styles.selectButton}>Select</button>
                  </div>
                </div>
              </div>
              <div className={styles.transferForm}>
                <h4>Transfer Details</h4>
                <div className={styles.formGroup}>
                  <label>Recipient Address</label>
                  <input type="text" placeholder="0x..." />
                </div>
                <div className={styles.formGroup}>
                  <label>Transfer Price (ETH)</label>
                  <input type="number" step="0.001" placeholder="0.05" />
                </div>
                <div className={styles.formGroup}>
                  <label>Message (Optional)</label>
                  <textarea placeholder="Add a message..." rows={3}></textarea>
                </div>
                <button className={styles.primaryButton}>
                  Transfer Ticket
                </button>
              </div>
            </div>
          </div>
        );

      case "my-tickets":
        return (
          <div className={styles.formContainer}>
            <h3>My Tickets</h3>
            <div className={styles.myTicketsContainer}>
              <div className={styles.ticketsGrid}>
                <div className={styles.ticketCardFull}>
                  <div className={styles.ticketHeader}>
                    <h4>Tech Conference 2024</h4>
                    <div className={styles.ticketStatus}>Valid</div>
                  </div>
                  <div className={styles.ticketDetails}>
                    <div className={styles.ticketInfo}>
                      <p><strong>Date:</strong> March 15, 2024</p>
                      <p><strong>Time:</strong> 9:00 AM - 6:00 PM</p>
                      <p><strong>Venue:</strong> Convention Center</p>
                      <p><strong>Seat:</strong> A-15</p>
                      <p><strong>Price:</strong> 0.05 ETH</p>
                    </div>
                    <div className={styles.ticketQR}>
                      <div className={styles.qrCode}>
                        <div className={styles.qrPattern}></div>
                        <p>QR Code</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    <button className={styles.primaryButton}>Download</button>
                    <button className={styles.secondaryButton}>Transfer</button>
                  </div>
                </div>

                <div className={styles.ticketCardFull}>
                  <div className={styles.ticketHeader}>
                    <h4>Music Festival</h4>
                    <div className={styles.ticketStatus}>Valid</div>
                  </div>
                  <div className={styles.ticketDetails}>
                    <div className={styles.ticketInfo}>
                      <p><strong>Date:</strong> April 20, 2024</p>
                      <p><strong>Time:</strong> 2:00 PM - 11:00 PM</p>
                      <p><strong>Venue:</strong> Central Park</p>
                      <p><strong>Type:</strong> General Admission</p>
                      <p><strong>Price:</strong> 0.08 ETH</p>
                    </div>
                    <div className={styles.ticketQR}>
                      <div className={styles.qrCode}>
                        <div className={styles.qrPattern}></div>
                        <p>QR Code</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    <button className={styles.primaryButton}>Download</button>
                    <button className={styles.secondaryButton}>Transfer</button>
                  </div>
                </div>

                <div className={styles.ticketCardFull}>
                  <div className={styles.ticketHeader}>
                    <h4>Art Exhibition</h4>
                    <div className={styles.ticketStatusUsed}>Used</div>
                  </div>
                  <div className={styles.ticketDetails}>
                    <div className={styles.ticketInfo}>
                      <p><strong>Date:</strong> February 10, 2024</p>
                      <p><strong>Time:</strong> 10:00 AM - 8:00 PM</p>
                      <p><strong>Venue:</strong> Modern Art Gallery</p>
                      <p><strong>Type:</strong> VIP Access</p>
                      <p><strong>Price:</strong> 0.12 ETH</p>
                    </div>
                    <div className={styles.ticketQR}>
                      <div className={styles.qrCode}>
                        <div className={styles.qrPattern}></div>
                        <p>QR Code</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.ticketActions}>
                    <button className={styles.secondaryButton} disabled>Event Ended</button>
                  </div>
                </div>
              </div>
              
              <div className={styles.ticketsSummary}>
                <h4>Ticket Summary</h4>
                <div className={styles.summaryStats}>
                  <div className={styles.summaryItem}>
                    <span>Total Tickets:</span>
                    <span>3</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Active Tickets:</span>
                    <span>2</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Used Tickets:</span>
                    <span>1</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Total Value:</span>
                    <span>0.25 ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "event-analytics":
        return (
          <div className={styles.formContainer}>
            <h3>Event Analytics Dashboard</h3>
            <div className={styles.analyticsContainer}>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h4>Total Events</h4>
                  <div className={styles.statNumber}>12</div>
                </div>
                <div className={styles.statCard}>
                  <h4>Tickets Sold</h4>
                  <div className={styles.statNumber}>1,247</div>
                </div>
                <div className={styles.statCard}>
                  <h4>Revenue (ETH)</h4>
                  <div className={styles.statNumber}>62.35</div>
                </div>
                <div className={styles.statCard}>
                  <h4>Active Events</h4>
                  <div className={styles.statNumber}>3</div>
                </div>
              </div>
              <div className={styles.chartContainer}>
                <h4>Sales Over Time</h4>
                <div className={styles.chartPlaceholder}>
                  <div className={styles.chartBars}>
                    <div className={styles.bar} style={{height: '60%'}}></div>
                    <div className={styles.bar} style={{height: '80%'}}></div>
                    <div className={styles.bar} style={{height: '45%'}}></div>
                    <div className={styles.bar} style={{height: '90%'}}></div>
                    <div className={styles.bar} style={{height: '70%'}}></div>
                  </div>
                  <p>📈 Interactive charts coming soon</p>
                </div>
              </div>
              <div className={styles.eventsList}>
                <h4>Recent Events</h4>
                <div className={styles.eventItem}>
                  <span>Tech Conference 2024</span>
                  <span>87/100 sold</span>
                  <span className={styles.statusActive}>Active</span>
                </div>
                <div className={styles.eventItem}>
                  <span>Music Festival</span>
                  <span>250/250 sold</span>
                  <span className={styles.statusSoldOut}>Sold Out</span>
                </div>
                <div className={styles.eventItem}>
                  <span>Art Exhibition</span>
                  <span>45/75 sold</span>
                  <span className={styles.statusActive}>Active</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <p>Feature coming soon...</p>;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <Image
          priority
          src="/eventkii-logo.svg"
          alt="EventKii Logo"
          width={400}
          height={200}
        />

        <p className={styles.tagline}>
          Your ticket. Your key. Onchain.
        </p>

        <p className={styles.description}>
          The future of event ticketing is here. EventKii transforms traditional tickets into secure digital keys on the blockchain, ensuring authenticity, preventing fraud, and creating new possibilities for event experiences.
        </p>

        <h2 className={styles.componentsTitle}>Platform Features</h2>

        <ul className={styles.components}>
          {features.map((feature) => (
            <li key={feature.name} className={styles.featureItem}>
              <div className={styles.featureContent}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureText}>
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
              <button 
                className={styles.featureButton}
                onClick={() => handleFeatureClick(feature.action)}
              >
                Launch
              </button>
            </li>
          ))}
        </ul>
      </div>

      {renderModal()}
    </div>
  );
}
