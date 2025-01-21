import Image from 'next/image'
import styles from "@/styles/Home.module.css";

import Meta from '../../components/Meta';

import beforeGif from '../../../assets/before.gif'
import afterGif from '../../../assets/after.gif'
import greenHeart from '../../../assets/greenHeart.png'
import pinkHeart from '../../../assets/pinkHeart.png'

import HeartButton from "../../components/HeartButton";
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
  "it's scary how much i want you",
  "haunt me with your presence bae",
  "boooooo",
  "she polter on my geist till i ectoplasm",
  "we could be like romeo and ghouliet",
  "till death do us part (so basically never)",
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
      <Meta
        title="send this to your crush 💌"
        description="digital valentine's day card"
        image="social-2024.jpeg"
      />
      <main className={`${styles.main} ${quicksand.className}`}>
          { yesPressed ? (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={afterGif}
              alt="the ghosts hard launch"
              className={styles.valentineGif}
            />
          </div>
          ) : (
          <div className={`flex items-center ${styles.buttonsContainer}`}>
            <Image
              src={beforeGif}
              alt="two ghosts that are deeply enamoured with each other and are consumed by the thoughts of being together romantically. one proposes to the other in a heartfelt confession of love on valentine's day that pulls at the heart strings of the audience in a way that the titanic movie could never.'"
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
