import Head from "next/head";
import Image from 'next/image'
import styles from "@/styles/Home.module.css";
import beforeGif from '../../assets/before.gif'
import HeartButton from "@/components/HeartButton";

export default function Home() {
  return (
    <>
      <Head>
        <title>dearcrush.love</title>
        <meta name="description" content="send this to your crush" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Image
          src={beforeGif}
          width={300}
          height={300}
          alt="two ghosts"
        />
        <HeartButton />
      </main>
    </>
  );
}
