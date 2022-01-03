import { useCallback, useEffect, useState } from "react";
import { useSpring } from "react-spring";
import { useExecutionQueue } from "use-execution-queue";
import { getPositionByRef, sleep } from "./util";
import useWindowSize from "./useWindowSize";

interface UseStepsProps {
  // TODO: Improve typing so it doesn't use only HTMLDivElement
  stepsRef: React.RefObject<HTMLDivElement>[];
  wrapperRef?: React.RefObject<HTMLDivElement>;
  offset?: { x: number; y: number };
  queueTime?: number;
  getPositionsAwaitTime?: number;
}

export const useStepAnimation = ({
  stepsRef,
  wrapperRef,
  offset = { x: 0, y: 0 },
  queueTime = 1000,
  getPositionsAwaitTime = 50,
}: UseStepsProps) => {
  const { height, width } = useWindowSize();
  const { addToQueue } = useExecutionQueue({ intervalTime: queueTime });
  const [step, setStep] = useState<number>(0);
  const [stepsPositions, setStepsPositions] = useState<
    { x: number; y: number }[]
  >([{ x: 0, y: 0 }]);

  useEffect(() => {
    const getPositions = async () => {
      await sleep(getPositionsAwaitTime);
      const wrapperPosition = wrapperRef
        ? getPositionByRef(wrapperRef)
        : { x: 0, y: 0 };
      setStepsPositions(
        stepsRef.map(getPositionByRef).map(({ x, y }) => ({
          x: x - wrapperPosition.x,
          y: y - wrapperPosition.y,
        }))
      );
    };
    getPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, width, getPositionsAwaitTime]);

  const nextStep = useCallback(() => {
    addToQueue(() => {
      setStep((previous) =>
        previous === stepsPositions.length - 1 ? previous : previous + 1
      );
    });
  }, [addToQueue, stepsPositions.length]);

  const previousStep = useCallback(() => {
    addToQueue(() =>
      setStep((previous) => (previous === 0 ? previous : previous - 1))
    );
  }, [addToQueue]);

  const props = useSpring({
    top: stepsPositions[step].y + offset.y,
    left: stepsPositions[step].x + offset.x,
  });

  return {
    animationProps: props,
    step,
    stepsPositions,
    nextStep,
    previousStep,
  };
};
