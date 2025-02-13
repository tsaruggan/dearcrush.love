import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/2025.module.css";


const buttonDim = 100;

export default function Canvas(props) {
    const canvasRef = useRef(null);
    const [yesImage, setYesImage] = useState(null);
    const [noImage, setNoImage] = useState(null);

    const loadImages = async () => {
        const greenHeartSrc = './assets/2025/greenHeart.png';
        const pinkHeartSrc = './assets/2025/pinkHeart.png';
    
        const yesImg = new Image();
        const noImg = new Image();
    
        // Wrap image loading in a Promise
        const loadImage = (img, src) => {
            return new Promise((resolve) => {
                img.src = src;
                img.onload = () => resolve(img);
            });
        };
    
        // Wait for both images to load
        const loadedYesImage = await loadImage(yesImg, greenHeartSrc);
        const loadedNoImage = await loadImage(noImg, pinkHeartSrc);
    
        // Set the images after they are loaded
        setYesImage(loadedYesImage);
        setNoImage(loadedNoImage);
    };

    const drawImages = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    
        // Set canvas size to window size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        if (yesImage && noImage) {
            const yPosition = canvas.height / 2;
            const xPositionYes = canvas.width / 3;
            const xPositionNo = (canvas.width * 2) / 3;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw images at fixed size without scaling
            ctx.drawImage(yesImage, xPositionYes - buttonDim / 2, yPosition - buttonDim / 2, buttonDim, buttonDim);
            ctx.drawImage(noImage, xPositionNo - buttonDim / 2, yPosition - buttonDim / 2, buttonDim, buttonDim);
        }
    };

    useEffect(() => {
        const setup = async () => {
            await loadImages();
        };
        setup();

        window.addEventListener('resize', drawImages);
        return () => {
            window.removeEventListener('resize', drawImages);
        };
    }, []);

    useEffect(() => {
        if (yesImage && noImage) {
            drawImages();
        }
    }, [yesImage, noImage]);

    return (
        <div>
            <canvas ref={canvasRef} className={styles.fullPageCanvas}></canvas>
        </div>
    );
};
