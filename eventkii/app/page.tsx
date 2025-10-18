"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";

export default function Home() {
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
          {[
            {
              name: "Create Events",
              description: "Launch your event with blockchain-secured tickets",
            },
            {
              name: "Mint Tickets",
              description: "Generate unique NFT tickets for attendees",
            },
            {
              name: "Verify Access",
              description: "Instant ticket validation at event entry",
            },
            {
              name: "Transfer Tickets",
              description: "Secure peer-to-peer ticket transfers",
            },
            {
              name: "Event Analytics",
              description: "Real-time insights and attendance tracking",
            },
          ].map((feature) => (
            <li key={feature.name} className={styles.featureItem}>
              <h3>{feature.name}</h3>
              <p>{feature.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
