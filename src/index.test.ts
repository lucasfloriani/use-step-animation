import { useStepAnimation } from ".";
import { renderHook, act } from "@testing-library/react-hooks";
import { useRef } from "react";
// import { Globals } from "react-spring";

// Globals.assign({
//   skipAnimation: true,
// });

// mock timer using jest
jest.useFakeTimers();
jest.mock("react", () => {
  const originReact = jest.requireActual("react");
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef,
  };
});

const SECOND = 1000;

describe("useStepAnimation", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("updates every second", () => {
    const callback = jest.fn();
    const { result } = renderHook(() => {
      const mockStep = (x = 0, y = 0) => ({
        getBoundingClientRect() {
          callback();
          return { x, y };
        },
      });
      const firstStepRef = useRef<any>(mockStep(100, 100));
      const stepTwoRef = useRef<any>(mockStep(200, 200));
      const stepThreeRef = useRef<any>(mockStep(320, 50));
      const stepFourRef = useRef<any>(mockStep(475, 300));
      const stepFiveRef = useRef<any>(mockStep(600, 30));

      return useStepAnimation({
        stepsRef: [
          firstStepRef,
          stepTwoRef,
          stepThreeRef,
          stepFourRef,
          stepFiveRef,
        ],
      });
    });

    act(() => result.current.nextStep());
    act(() => {
      jest.advanceTimersByTime(SECOND);
    });
    console.log("callback.mock.calls.length:", callback.mock.calls.length);
    expect(callback.mock.calls.length).toBe(5);
    expect(result.current.animationProps.top).toBe("100px");
    expect(result.current.animationProps.left).toBe("100px");
  });
});
