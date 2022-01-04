export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getPositionByRef = (ref: React.RefObject<HTMLDivElement>) => {
  const { x, y } = ref?.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
  return { x, y };
};
