import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ weddingDate }: { weddingDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const target = new Date(weddingDate + "T00:00:00").getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsPast(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  if (isPast) {
    return (
      <div className="text-center">
        <p className="font-cinzel text-xl tracking-widest gold-text">We Are Married!</p>
      </div>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center rounded-md border border-primary/30 bg-white/10 backdrop-blur-sm shadow-lg">
            <span className="font-cinzel text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {String(value).padStart(2, "0")}
            </span>
          </div>
          <span className="mt-2 text-xs md:text-sm tracking-widest uppercase text-white/80 font-light">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
