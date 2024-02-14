import styles from "@/styles/Button.module.css";
import heart from '../../assets/heart.png'

export default function HeartButton({ buttonText, hue, onClick }) {
    return (
        <button className={styles.heartButton} onClick={onClick} >
            <div className={styles.heartButtonContainer}>
                <img 
                    src={heart.src} 
                    className={styles.shadow} 
                    style={{ filter: `hue-rotate(${hue}deg) saturate(20%) brightness(160%)`}}
                />
                <img 
                    src={heart.src} 
                    className={styles.heartImage} 
                    style={{ filter: `hue-rotate(${hue}deg) saturate(20%) brightness(180%)`}}
                />
                <span className={styles.buttonText}>{buttonText.toUpperCase()}</span>
            </div>
        </button>
    );
}