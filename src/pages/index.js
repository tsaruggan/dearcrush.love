import Head from "next/head";
import Image from 'next/image'
import styles from "@/styles/Home.module.css";
import beforeGif from '../../assets/before.gif'
import afterGif from '../../assets/after.gif'
import HeartButton from "../components/HeartButton";
import { useState } from "react";

export default function Home() {
  const [yesPressed, setYesPressed] = useState(false);

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
                buttonText={"YES"}
                hue={100}
                onClick={() => setYesPressed(true)}
              />
              <HeartButton 
                buttonText={"NO"}
                hue={0}
                onClick={() => console.log("NO")}
              />
            </div>
          </div>
          )}
      </main>
    </>
  );
}
