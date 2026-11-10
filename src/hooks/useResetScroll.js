import { useEffect, useRef } from 'react';

export const useResetScroll = (isActive, resetSignal) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!isActive) return undefined;

    let secondFrame;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
    };
  }, [isActive, resetSignal]);

  return scrollRef;
};