import Header from "../components/Header";
import Footer from "../components/Footer";
import BookCard from "../components/BookCard";
import AdSlot from "../components/AdSlot";
import { HOME_BANNER_AD } from "../config/ads";

export default function Home() {
  const serials = ["001", "002", "003", "004", "005", "006"];

  return (
    <div>
      <Header />
      <main className="p-6 max-w-6xl mx-auto">
        <section className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Discover 999 Unique Thai Books</h1>
          <p className="text-sm sm:text-base mt-1">Make Your Offer & Own a Piece of Thai Literature</p>
        </section>

        <AdSlot html={HOME_BANNER_AD} className="flex justify-center mb-6" />

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {serials.map((serial) => (
            <BookCard key={serial} serial={serial} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
