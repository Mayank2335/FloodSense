import { useState, useEffect } from 'react';

export function useRealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    time,
    formattedTime: time.toLocaleTimeString('en-US', { hour12: false }), // Military time usually preferred in Ops
    formattedDate: time.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  };
}
