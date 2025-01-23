/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/react-in-jsx-scope */
import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import Meta from '../../components/Meta';
import DrawingCanvas from '../../components/DrawingCanvas';

import beforeGif from '../../assets/2025/placeholder-bee.png'
import afterGif from '../../assets/2025/placeholder-bee.png'

import { useState } from "react";

const messages = [
  "you're as sweet as honey",
  "you're my queen bee",
  "ooof...\nthat stings",
  "you are bee-you-tiful"
];

export default function Home() {
    const [yesPressed, setYesCircled] = useState(false);

    // set conditions for circling yes or no
    // if yes circled, continue to after gif
    // if no is almost circled, move position of no

    return (
        <>
          <Meta
            title="send this to your crush 💌"
            description="digital valentine's day card"
            image="social-2024.jpeg"
          />
          <main className={`${styles.main}`}>
          { yesPressed ? (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={afterGif}
              alt="yipee bee"
              className={styles.valentineGif}
            />
          </div>
          ) : (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={beforeGif}
              alt="messenger bee coming up to you and asking if you would bee my valentine"
              className={styles.valentineGif}
            />

            <span className={styles.message}>{"will you bee my valentine?"}</span>
            <div>
              <h1>Welcome to the Drawing App!</h1>
              <DrawingCanvas />
            </div>
            <div className={styles.buttonRow}>
              yes
              no
            </div>
          </div>
          )}
      </main>
        </>
      );
}