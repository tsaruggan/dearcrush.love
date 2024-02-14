import Head from "next/head";
import Image from 'next/image'
import styles from "@/styles/Home.module.css";
import beforeGif from '../../assets/before.gif'
import afterGif from '../../assets/after.gif'
import HeartButton from "../components/HeartButton";
import { useState } from "react";

const yesText = "BE MY BOO";
const noTexts = [
  "HELL NAH",
  "YOU SURE?",
  "BEEN DYING TO ASK :(", 
  "DON'T GHOST ME",
  "BOOOOO",
  "OKAY FINE"
];

const defaultYesHue = 100;
const defaultNoHue = 0;

export default function Home() {
  const [yesPressed, setYesPressed] = useState(false);
  const [noIndex, setNoIndex] = useState(0);
  const [noHue, setNoHue] = useState(defaultNoHue);

  const onNoButtonClick = (e) => {
    // console.log(e);
    if (noIndex == noTexts.length - 1) {
      setYesPressed(true);
    } else {
      if (noIndex + 1 == noTexts.length - 1) {
        setNoHue(defaultYesHue);
      } else {
        setNoHue((defaultYesHue * 0.70 - defaultNoHue) / (noTexts.length - 1) * (noIndex + 1));
      }
      
      setNoIndex(noIndex + 1);
    }
  }

  return (
    <>
      <Head>
        <title>dearcrush.love</title>
        <meta name="description" content="send this to your crush" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
          { yesPressed ? (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={afterGif}
              alt="two ghosts hugging, made by saru & tam"
              className={styles.valentineGif}
            />
          </div>
          ) : (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={beforeGif}
              alt="one ghost asking another 'will you be my valentine?'"
              className={styles.valentineGif}
            />
            <div className={styles.buttonRow}>
              {/* <button onClick={() => setYesPressed(true)}>Yes</button>
              <button>No</button> */}
              <HeartButton 
                buttonText={yesText}
                hue={defaultYesHue}
                onClick={() => setYesPressed(true)}
              />
              <HeartButton 
                buttonText={noTexts[noIndex]}
                hue={noHue}
                onClick={onNoButtonClick}
              />
            </div>
          </div>
          )}
      </main>
    </>
  );
}
