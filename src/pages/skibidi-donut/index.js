/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/react-in-jsx-scope */
import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import Meta from '../../components/Meta';
import DrawingCanvas from '../../components/DrawingCanvas';

import beforeGif from '../../../public/assets/2025/bee_my_valentine.gif'
import afterGif from '../../../public/assets/2025/yipee_bee.gif'
import circleOne from '../../../public/assets/2025/circle-one.png'

import { Comfortaa } from "next/font/google";
import { useState } from "react";

const messages = [
  "you're as sweet as honey",
  "you're my queen bee",
  "ooof...\nthat stings",
  "you are bee-you-tiful"
];

const comfortaa = Comfortaa({ subsets: ['latin'] })

export default function Home() {
    const [circledYes, setCircledYes] = useState(false);
    const [circledNo, setCircledNo] = useState(false);

    const handleCircledYes = () => {
      setCircledYes(true);
    }

    const handleCircledNo = () => {
      setCircledNo(true);
    }

    return (
        <>
          <Meta
            title="send this to your crush 💌"
            description="digital valentine's day card"
            image="social-2024.jpeg"
          />
          <main className={`${styles.main} ${comfortaa.className}`}>
          { circledYes ? (
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
            <Image
              src={circleOne}
              alt="(circle one)"
              className={styles.circleOne}
              style={{ width: '250px', height: 'auto' }}
            />
            {/* <span className={styles.message}>{"circle one"}</span> */}
            <div>
              <DrawingCanvas
                onYes={handleCircledYes}
                onNo={handleCircledNo}
              />
            </div>
          </div>
          )}
      </main>
        </>
      );
}