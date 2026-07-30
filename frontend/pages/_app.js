import '../styles/globals.css'
import { useEffect } from 'react'
import Head from 'next/head'
import { appWithTranslation } from 'next-i18next'
import AdSlot from '../components/AdSlot'
import { SOCIAL_BAR_AD } from '../config/ads'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, []);

  return (
    <>
      <Head>
        {/* This is the key fix for mobile layout issues: without it, phones
            render the page at a fixed desktop width and then zoom/crop it,
            which is why the header looked "cut off" on the right. */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <Component {...pageProps} />
      {/* Loads once, site-wide - matches Adsterra's Social Bar behavior */}
      <AdSlot html={SOCIAL_BAR_AD} />
    </>
  );
}

export default appWithTranslation(MyApp)
