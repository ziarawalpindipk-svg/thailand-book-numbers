import '../styles/globals.css'
import { useEffect } from 'react'
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
      <Component {...pageProps} />
      {/* Loads once, site-wide - matches Adsterra's Social Bar behavior */}
      <AdSlot html={SOCIAL_BAR_AD} />
    </>
  );
}

export default appWithTranslation(MyApp)
