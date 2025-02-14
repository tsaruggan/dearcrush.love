/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/react-in-jsx-scope */
import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import Meta from '@/components/Meta';
import DrawingCanvas from '@/components/DrawingCanvas';

import beforeGif from '../../public/assets/2025/bee_my_valentine.gif'
import afterGif from '../../public/assets/2025/yipee_bee.gif'

import { useState } from "react";

export default function Home() {
    const [circledYes, setCircledYes] = useState(false);

    const handleCircledYes = () => {
      setCircledYes(true);
    }

    const renderBefore = () => {
      return (
        <div className={styles.container}>
          <main className={styles.main}>
              <div className={styles.backgroundContainer}>
                  <Image
                      src={beforeGif}
                      alt="messenger bee coming up to you and asking if you would bee my valentine"
                      className={styles.backgroundGif}
                  />
              </div>
          </main>
          <DrawingCanvas
              onYes={handleCircledYes}
          />
        </div>
      );
    }

    const renderAfter = () => {
      return (
        <div className={styles.container}>
          <main className={styles.main}>
              <div className={styles.backgroundContainer}>
                  <Image
                      src={afterGif}
                      alt="messenger bee overcome with great joy after receiving love reciprocated"
                      className={styles.backgroundGif}
                  />
              </div>
          </main>
        </div>
      );
    }
    
    const renderContent = () => {
      if (circledYes) {
        return renderAfter();
      } else {
        return renderBefore();
      }
    };

    return (
      <>
          <Meta
              title="send this to your crush 💌"
              description="digital valentine's day card"
              image="social-2025.jpeg"
          />
          {renderContent()}
      </>
  );
}