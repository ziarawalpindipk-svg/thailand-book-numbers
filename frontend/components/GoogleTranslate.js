import { useEffect } from "react";
import Script from "next/script";

// Uses Google's inline translate widget, which translates the page's text
// in place (same URL, same page) - unlike the translate.google.com proxy
// approach, this does NOT break interactive elements like the book-number
// selection dialog, and does not trigger Google's "this form isn't
// supported" warning. Ads keep working too, since we never leave the page.
export default function GoogleTranslate() {
  useEffect(() => {
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };
  }, []);

  return (
    <>
      <div id="google_translate_element" className="notranslate tb-google-translate" />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
