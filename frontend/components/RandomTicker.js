import { useEffect, useState } from "react";

function randomNumber() {
  return Math.floor(Math.random() * 1000).toString().padStart(3, "0");
}

// Purely decorative - eye-catching movement to draw attention to the bar.
// It doesn't select anything or navigate anywhere; tapping it just
// re-shuffles immediately for a little bit of fun interactivity.
export default function RandomTicker() {
  const [value, setValue] = useState("000");

  useEffect(() => {
    setValue(randomNumber());
    const interval = setInterval(() => {
      setValue(randomNumber());
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => setValue(randomNumber())}
      className="flex items-center gap-1.5 bg-white text-teal-800 rounded-full pl-2 pr-3 py-1 shadow-md border border-teal-100 font-semibold text-sm shrink-0"
      title="Just for fun"
    >
      <span className="text-base leading-none">🎲</span>
      <span className="font-mono tabular-nums w-8 text-center transition-all">
        {value}
      </span>
    </button>
  );
}
