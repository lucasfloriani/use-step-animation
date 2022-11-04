import { renderHook, act, waitFor } from '@testing-library/react';
import { useStepAnimation } from '.';

jest.useFakeTimers();
jest.mock('react-spring', () => ({
  ...jest.requireActual('react-spring'),
  useSpring: (value: object): object => value,
}));
jest.mock('./util', () => ({
  ...jest.requireActual('./util'),
  sleep: (value: object): Promise<object> =>
    new Promise((resolve) => {
      resolve(value);
    }),
}));

interface Coordinates {
  x: number;
  y: number;
}

interface MockRef {
  current: {
    getBoundingClientRect: () => Coordinates;
  };
}

const SECOND = 1000;
const mockStep = (x = 0, y = 0): MockRef => ({
  current: {
    getBoundingClientRect: (): Coordinates => ({ x, y }),
  },
});

describe('useStepAnimation', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('should update state correctly after each action is executed', async () => {
    const { result } = renderHook(() => {
      const firstStepRef = mockStep(100, 100);
      const stepTwoRef = mockStep(200, 200);
      const stepThreeRef = mockStep(320, 50);
      const stepFourRef = mockStep(475, 300);
      const stepFiveRef = mockStep(600, 30);

      return useStepAnimation({
        stepsRef: [firstStepRef, stepTwoRef, stepThreeRef, stepFourRef, stepFiveRef],
      });
    });

    await waitFor(() => {
      expect(result.current.step).toBe(0);
      expect(result.current.animationProps.top).toBe(100);
      expect(result.current.animationProps.left).toBe(100);
      expect(result.current.stepsPositions).toEqual([
        { x: 100, y: 100 },
        { x: 200, y: 200 },
        { x: 320, y: 50 },
        { x: 475, y: 300 },
        { x: 600, y: 30 },
      ]);
    });

    const testStep = async ({
      stepType = 'next',
      step,
      top,
      left,
    }: {
      stepType: 'next' | 'previous';
      step: number;
      top: number;
      left: number;
    }): Promise<void> => {
      act(() => result.current[stepType === 'next' ? 'nextStep' : 'previousStep']());
      act(() => jest.advanceTimersByTime(SECOND));

      await waitFor(() => expect(result.current.step).toBe(step));
      expect(result.current.animationProps.top).toBe(top);
      expect(result.current.animationProps.left).toBe(left);
    };

    await testStep({
      stepType: 'next',
      step: 1,
      top: 200,
      left: 200,
    });

    await testStep({
      stepType: 'next',
      step: 2,
      top: 50,
      left: 320,
    });

    await testStep({
      stepType: 'next',
      step: 3,
      top: 300,
      left: 475,
    });

    await testStep({
      stepType: 'next',
      step: 4,
      top: 30,
      left: 600,
    });

    await testStep({
      stepType: 'next',
      step: 4,
      top: 30,
      left: 600,
    });

    await testStep({
      stepType: 'previous',
      step: 3,
      top: 300,
      left: 475,
    });

    await testStep({
      stepType: 'previous',
      step: 2,
      top: 50,
      left: 320,
    });

    await testStep({
      stepType: 'previous',
      step: 1,
      top: 200,
      left: 200,
    });

    await testStep({
      stepType: 'previous',
      step: 0,
      top: 100,
      left: 100,
    });

    await testStep({
      stepType: 'previous',
      step: 0,
      top: 100,
      left: 100,
    });
  });
});
