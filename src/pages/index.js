import Head from "next/head";
import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import beforeGif from '../../assets/before.gif'
import afterGif from '../../assets/after.gif'
import greenHeart from '../../assets/greenHeart.png'
import pinkHeart from '../../assets/pinkHeart.png'

import HeartButton from "../components/HeartButton";
import { Quicksand } from "next/font/google";
import { useState } from "react";

const defaultYesText = "YES";
const defaultNoText = "NO";
const noTextAfter = "OKAY FINE"

const messages = [
  "be my boo",
  "please",
  "i've been dying to ask you",
  "pls don't ghost me",
  "but ur so boo-tiful",
  "you can be my spooky pookie wookie",
  "we could be soulmates ;)",
  "ur the danny to my phantom",
  "insidious? let's talk about insidi–us",
  "you got me acting paranormal",
  "haunt me with your presence bae",
  "we can be like romeo and ghouliet",
  "till death do us part (so basically never)",
  "boooooo",
  "i’ll haunt you forever ❤️"
];

const quicksand = Quicksand({ subsets: ['latin'] })

export default function Home() {
  const [yesPressed, setYesPressed] = useState(false);
  const [noIndex, setNoIndex] = useState(0);
  const [noText, setNoText] = useState(defaultNoText);

  const onNoButtonClick = (e) => {
    // console.log(e);
    if (noIndex == messages.length - 1) {
      setYesPressed(true);
    } else {
      if (noIndex + 1 == messages.length - 1) {
        setNoText(noTextAfter);
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
      <main className={`${styles.main} ${quicksand.className}`}>
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

            <span className={styles.message}>{messages[noIndex]}</span>
            
            <div className={styles.buttonRow}>
              <HeartButton 
                image={greenHeart}
                buttonText={defaultYesText}
                onClick={() => setYesPressed(true)}
              />
              <HeartButton 
                image={noIndex == messages.length-1 ? greenHeart : pinkHeart}
                buttonText={noText}
                onClick={onNoButtonClick}
              />
            </div>
          </div>
          )}
      </main>
    </>
  );
}
