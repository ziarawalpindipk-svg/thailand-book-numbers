import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookNumberGrid from "../components/BookNumberGrid";
import AdSlot from "../components/AdSlot";
import ImageAdCard from "../components/ImageAdCard";
import { HOME_BANNER_AD } from "../config/ads";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Home() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/ads`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAds(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <Header />
      <main className="p-4 sm:p-6 max-w-5xl mx-auto pb-20 md:pb-6">
        <section className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">
            Discover 000 to 999 Unique Thai Book Numbers
          </h1>
          <p className="text-sm sm:text-base mt-1 text-gray-600">
            Make Your Offer & Own a Piece of Thai Literature
          </p>
          <Link href="/how-to-offer" className="inline-block mt-2 text-sm text-teal-700 underline">
            ❓ How does this work?
          </Link>
        </section>

        <AdSlot html={HOME_BANNER_AD} className="flex justify-center mb-6" />

        <BookNumberGrid />

        {ads.length > 0 && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">Sponsored</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <ImageAdCard key={ad._id} ad={ad} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
