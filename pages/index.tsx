import Head from "next/head";
import Image from "next/image";
import ConnectFour from "../components/connect-four";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Connect four</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectFour />
      </main>
    </div>
  );
}
