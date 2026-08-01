import Header from "../components/Header";
import Footer from "../components/Footer";
import BookNumberGrid from "../components/BookNumberGrid";
import AdSlot from "../components/AdSlot";
import { HOME_BANNER_AD } from "../config/ads";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-4 sm:p-6 max-w-5xl mx-auto pb-20 md:pb-6">
        <section className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Discover 000 to 999 Unique Thai Book Numbers
          </h1>
          <p className="text-sm sm:text-base mt-1">
            Make Your Offer & Own a Piece of Thai Literature
          </p>
        </section>

        <AdSlot html={HOME_BANNER_AD} className="flex justify-center mb-6" />

        <BookNumberGrid />
      </main>
      <Footer />
    </div>
  );
}
