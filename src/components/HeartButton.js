import styles from "@/styles/Button.module.css";
import heart from '../../assets/heart.png'
import { useState } from "react";

export default function HeartButton({ buttonText, hue, onClick }) {
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
                    src={heart.src} 
                    className={styles.shadow} 
                    style={{ filter: `hue-rotate(${hue}deg) saturate(20%) brightness(160%)`, transform: `translateZ(0)`}}
                />
                <img 
                    src={heart.src} 
                    className={styles.heartImage} 
                    style={{ filter: `hue-rotate(${hue}deg) saturate(20%) brightness(180%)`, transform: `translateZ(0)`}}
                />
                <span className={styles.buttonText}>{buttonText.toUpperCase()}</span>
            </div>
        </button>
    );
}

const getRandomValue = (min, max) => Math.random() * (max - min) + min;