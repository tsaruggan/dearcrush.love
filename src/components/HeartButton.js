import styles from "@/styles/Button.module.css";
import { Quicksand } from "next/font/google";
import { useState } from "react";

const quicksand = Quicksand({ subsets: ['latin'] })

export default function HeartButton({ image, buttonText, onClick }) {
    const [isClicked, setIsClicked] = useState(false);

    const handleButtonClick = () => {
        setIsClicked(true);
        setTimeout(() => {
          setIsClicked(false);
        }, 200); // Adjust the delay time to match your animation duration
        onClick();
    };

    return (
        <button className={`${styles.heartButton} ${isClicked ? styles.clicked : ''}`} onClick={handleButtonClick} >
            <div className={styles.heartButtonContainer}>
                <img 
                    src={image.src} 
                    className={styles.heartImage} 
                />
                <span className={`${styles.buttonText} ${quicksand.className}`}>{buttonText.toUpperCase()}</span>
            </div>
        </button>
    );
}

const getRandomValue = (min, max) => Math.random() * (max - min) + min;