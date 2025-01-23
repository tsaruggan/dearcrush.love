/* eslint-disable react/react-in-jsx-scope */
import styles from "@/styles/Home.module.css";

import { Quicksand } from "next/font/google";
import Meta from '../components/Meta';

const quicksand = Quicksand({ subsets: ['latin'] })

export default function Home() {

  return (
    <>
      <Meta
        title="send this to your crush 💌"
        description="digital valentine's day card"
        image="social-2024.jpeg"
      />
      <main className={`${styles.underConstruction} ${quicksand.className}`}>
        <div>
        this page is a work in progress!<br/>

        in the meanwhile, check out our <a href="archive-2024">archive</a>
        </div>
      </main>
    </>
  );
}
