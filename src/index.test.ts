import { useStepAnimation } from ".";
import { renderHook, act } from "@testing-library/react-hooks";

jest.useFakeTimers();
jest.mock("react-spring", () => ({
  ...jest.requireActual("react-spring"),
  useSpring: (value: object) => value,
}));
jest.mock("./util", () => ({
  ...jest.requireActual("./util"),
  sleep: (value: object) =>
    new Promise((resolve) => {
      resolve(value);
    }),
}));

const SECOND = 1000;
const mockStep = (x = 0, y = 0): any => ({
  current: {
    getBoundingClientRect() {
      return { x, y };
    },
  },
});

describe("useStepAnimation", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("should update state correctly after each action is executed", async () => {
    const { result, waitForNextUpdate } = renderHook(() => {
      const firstStepRef = mockStep(100, 100);
      const stepTwoRef = mockStep(200, 200);
      const stepThreeRef = mockStep(320, 50);
      const stepFourRef = mockStep(475, 300);
      const stepFiveRef = mockStep(600, 30);

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

    await waitForNextUpdate();

    expect(result.current.animationProps.top).toBe(100);
    expect(result.current.animationProps.left).toBe(100);
    expect(result.current.step).toBe(0);
    expect(result.current.stepsPositions).toEqual([
      { x: 100, y: 100 },
      { x: 200, y: 200 },
      { x: 320, y: 50 },
      { x: 475, y: 300 },
      { x: 600, y: 30 },
    ]);

    act(() => {
      result.current.nextStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(200);
    expect(result.current.animationProps.left).toBe(200);
    expect(result.current.step).toBe(1);

    act(() => {
      result.current.nextStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(50);
    expect(result.current.animationProps.left).toBe(320);
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.nextStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(300);
    expect(result.current.animationProps.left).toBe(475);
    expect(result.current.step).toBe(3);

    act(() => {
      result.current.nextStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(30);
    expect(result.current.animationProps.left).toBe(600);
    expect(result.current.step).toBe(4);

    act(() => {
      result.current.nextStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(30);
    expect(result.current.animationProps.left).toBe(600);
    expect(result.current.step).toBe(4);

    act(() => {
      result.current.previousStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(300);
    expect(result.current.animationProps.left).toBe(475);
    expect(result.current.step).toBe(3);

    act(() => {
      result.current.previousStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(50);
    expect(result.current.animationProps.left).toBe(320);
    expect(result.current.step).toBe(2);

    act(() => {
      result.current.previousStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(200);
    expect(result.current.animationProps.left).toBe(200);
    expect(result.current.step).toBe(1);

    act(() => {
      result.current.previousStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(100);
    expect(result.current.animationProps.left).toBe(100);
    expect(result.current.step).toBe(0);

    act(() => {
      result.current.previousStep();
      jest.advanceTimersByTime(SECOND);
    });

    expect(result.current.animationProps.top).toBe(100);
    expect(result.current.animationProps.left).toBe(100);
    expect(result.current.step).toBe(0);
  });
});
