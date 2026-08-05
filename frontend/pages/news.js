import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdSlot from "../components/AdSlot";
import RichText from "../components/RichText";
import { HOME_BANNER_AD } from "../config/ads";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    fetchNews();
    // If loading takes more than a few seconds, the backend is probably
    // just waking up from being idle (normal on the free hosting tier) -
    // let the visitor know instead of leaving them guessing.
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  async function fetchNews() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/news`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load news");
      setNews(data);
    } catch (err) {
      setError(err.message || "Could not load news right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header />
      <main className="p-6 max-w-3xl mx-auto pb-20 md:pb-6">
        <h1 className="text-2xl font-bold text-teal-800 mb-4">Media & News</h1>

        <AdSlot html={HOME_BANNER_AD} className="flex justify-center mb-6" />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {loading ? (
          <p className="text-gray-600">
            {slow
              ? "Still loading... the server may be waking up after being idle, this can take up to a minute the first time."
              : "Loading news..."}
          </p>
        ) : news.length === 0 ? (
          <p className="text-gray-500">No news posted yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <article key={item._id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full max-h-72 object-contain bg-gray-100"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-bold text-lg text-teal-800 mb-1">{item.title}</h2>
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700">
                    <RichText text={item.content} />
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
