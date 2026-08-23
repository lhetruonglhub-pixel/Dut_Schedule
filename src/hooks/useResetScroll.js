import { useEffect, useRef } from 'react';

export const useResetScroll = (isActive, resetSignal) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    });
  }, [resetSignal]);

  useEffect(() => {
    if (!isActive) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      });
    });
  }, [isActive]);

  return scrollRef;
};