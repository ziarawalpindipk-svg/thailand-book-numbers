import Header from "../components/Header";
import Footer from "../components/Footer";
import AdSlot from "../components/AdSlot";
import { HOME_BANNER_AD } from "../config/ads";

const STEPS = [
  {
    title: "1. Browse Book Numbers",
    text: "Every book has a unique number from 000 to 999. Use the search box or the quick-jump buttons on the Home page to browse them.",
  },
  {
    title: "2. Pick a Number",
    text: "Tap any number to open the offer box for that book.",
  },
  {
    title: "3. Set Your Offer",
    text: "Enter how much you'd like to offer (minimum 1, in whichever currency you've selected from the menu at the top).",
  },
  {
    title: "4. Add It to Your Selection",
    text: "Tap \"Add\" - the number is now saved in your Selected list. You can add as many numbers as you like.",
  },
  {
    title: "5. Review & Checkout",
    text: "Open \"Selected\" from the menu to review your choices, then go to Checkout and fill in your name, country, and WhatsApp number.",
  },
  {
    title: "6. Send Your Offer",
    text: "Tap \"Send Offer\". WhatsApp will open with your offer already written out - just tap Send.",
  },
  {
    title: "7. Wait for a Reply",
    text: "The owner reviews every offer personally and will message you back on WhatsApp to confirm or discuss your offer and arrange payment.",
  },
];

export default function HowToOffer() {
  return (
    <div>
      <Header />
      <main className="p-6 max-w-3xl mx-auto pb-20 md:pb-6">
        <h1 className="text-2xl font-bold text-teal-800 mb-4">How to Make an Offer</h1>
        <p className="text-gray-600 mb-6">
          No account needed - here's exactly how buying a book number works, step by step.
        </p>

        <AdSlot html={HOME_BANNER_AD} className="flex justify-center mb-6" />

        <div className="space-y-4">
          {STEPS.map((step) => (
            <div key={step.title} className="border rounded-lg p-4 bg-white shadow-sm">
              <h2 className="font-semibold text-teal-700 mb-1">{step.title}</h2>
              <p className="text-sm text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">A few important notes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Minimum offer per book is 1 unit of whichever currency you've selected.</li>
            <li>Sending an offer does not guarantee it will be accepted - the owner reviews every offer.</li>
            <li>You can pick your currency from the top menu before you start - switching later will clear your current selection.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
