import { RefObject } from 'react';

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getPositionByRef = (ref: RefObject<HTMLElement>): { x: number; y: number } => {
  const { x, y } = ref?.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
  return { x, y };
};
