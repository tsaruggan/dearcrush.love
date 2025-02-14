import React, { useState, useEffect, useRef } from "react";
import Meta from '../../components/Meta';
import styles from "@/styles/2025.module.css";
import Image from 'next/image'
import Canvas from "@/components/Canvas";
import DrawingCanvas from '../../components/DrawingCanvas';

import beforeGif from '../../../public/assets/2025/bee_my_valentine.gif'

export default function Home(props) {
    const handleYes = () => {
        console.log("Yes");
    }

    const handleNo = () => {
        console.log("No");
    }
    return (
        <>
            <Meta
                title="send this to your crush 💌"
                description="digital valentine's day card"
                image="social-2024.jpeg"
            />
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.backgroundContainer}>
                        <Image
                            src={beforeGif}
                            alt="messenger bee coming up to you and asking if you would bee my valentine"
                            className={styles.backgroundGif}
                        />
                    </div>
                </main>
                <DrawingCanvas
                    onYes={handleYes}
                    onNo={handleNo}
                />
            </div>

        </>
    );
}



