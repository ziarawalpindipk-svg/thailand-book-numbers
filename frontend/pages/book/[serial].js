import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AdSlot from "../../components/AdSlot";
import { BOOK_DETAILS_BANNER_AD } from "../../config/ads";

export default function BookDetails() {
  const router = useRouter();
  const { serial } = router.query;

  return (
    <div>
      <Header />
      <main className="p-6 max-w-3xl mx-auto pb-20 md:pb-6">
        <h1 className="text-2xl font-bold">Book #{serial}</h1>
        <img src="/placeholder.png" alt="Book Cover" className="w-64 h-80 object-cover mt-4" />
        <p className="mt-4">Status: Available</p>
        <p>This is a sample description for Book #{serial}.</p>
        <AdSlot html={BOOK_DETAILS_BANNER_AD} className="flex justify-center mt-6" />
      </main>
      <Footer />
    </div>
  );
}
