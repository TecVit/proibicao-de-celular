'use client';

import { useEffect, useState } from 'react';

interface CounterData {
  initialCount: number,
}

const Counter = ({ initialCount }: CounterData) => {
  const [currentValue, setCurrentValue] = useState(initialCount - 100);
  const end = initialCount;
  const duration = 3500;

  useEffect(() => {
    const increment = (end - currentValue) / (duration / 100);
    let current = currentValue;

    const interval = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      setCurrentValue(Math.round(current));
    }, 100);

    return () => clearInterval(interval);
  }, [currentValue, end, duration]);

  return (
    <>{currentValue.toLocaleString('pt-BR')}</>
  );
};

export default Counter;