import { useState, useEffect } from 'react';

interface WindowSize {
  height: number;
  width: number;
}

const useWindowSize = (): WindowSize => {
  const isSSR = typeof window === 'undefined';
  const [windowSize, setWindowSize] = useState({
    width: isSSR ? 1200 : window.innerWidth,
    height: isSSR ? 800 : window.innerHeight,
  });

  useEffect(() => {
    const changeWindowSize = (): void => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', changeWindowSize);
    return (): void => window.removeEventListener('resize', changeWindowSize);
  }, []);

  return windowSize;
};

export default useWindowSize;
