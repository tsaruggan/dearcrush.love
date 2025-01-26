/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/react-in-jsx-scope */
import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import Meta from '../../components/Meta';
import DrawingCanvas from '../../components/DrawingCanvas';

import beforeGif from '../../../public/assets/2025/placeholder-bee.png'
import afterGif from '../../../public/assets/2025/placeholder-bee.png'
import yesPng from '../../../public/assets/2025/placeholder-yes.png'
import noPng from '../../../public/assets/2025/placeholder-no.png'

import { useState } from "react";

const messages = [
  "you're as sweet as honey",
  "you're my queen bee",
  "ooof...\nthat stings",
  "you are bee-you-tiful"
];

export default function Home() {
    const canvasWidth = 500;
    const canvasHeight = 400;
    const [circledYes, setCircledYes] = useState(false);
    const [circledNo, setCircledNo] = useState(false);
    const [noPosition, setNoPosition] = useState({ x: canvasWidth/4 * 3, y: canvasHeight/3 });

    const handleCircledYes = (circled) => {
      setCircledYes(circled);
    }

    const handleCircledNo = (circled) => {
      setCircledNo(circled);
    }

    const moveNoPosition = () => {
      setNoPosition({ x: 40, y: 50 }); // Example of changing position
    };

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

            <span className={styles.message}>{"will you bee my valentine?"}</span>
            <div>
              <DrawingCanvas
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                noPosX={noPosition.x}
                noPosY={noPosition.y}
                selectedYes={handleCircledYes}
                selectedNo={handleCircledNo}
              />
            </div>
          </div>
          )}
      </main>
        </>
      );
}