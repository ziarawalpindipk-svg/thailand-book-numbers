export default function ImageAdCard({ ad }) {
  const content = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.imageUrl}
      alt={ad.altText || "Advertisement"}
      className="w-full h-32 sm:h-40 object-contain bg-gray-100 rounded"
    />
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      {ad.linkUrl ? (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}
