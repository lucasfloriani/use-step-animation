import React from 'react';
import { animated } from 'react-spring';
import { useStepAnimation } from 'use-step-animation';

const App = () => {
  const [queueTime, setQueueTime] = React.useState(1000);
  const [disabled, setDisabled] = React.useState(false);

  const wrapperRef = React.useRef();
  const stepOneRef = React.useRef();
  const stepTwoRef = React.useRef();
  const stepThreeRef = React.useRef();
  const stepFourRef = React.useRef();
  const stepFiveRef = React.useRef();

  const { animationProps, step, nextStep, previousStep } = useStepAnimation({
    wrapperRef,
    stepsRef: [stepOneRef, stepTwoRef, stepThreeRef, stepFourRef, stepFiveRef],
    offset: { x: 0, y: 0 },
    queueTime,
    getPositionsAwaitTime: 0,
  });

  return (
    <main className="content">
      <header className="header">
        <div className="header__actions">
          <button
            className="button"
            onClick={() => {
              setDisabled(true);
              setTimeout(() => setDisabled(false), queueTime);
              previousStep();
            }}
            disabled={disabled}
          >
            Previous
          </button>
          <button
            className="button"
            onClick={() => {
              setDisabled(true);
              setTimeout(() => setDisabled(false), queueTime);
              nextStep();
            }}
            disabled={disabled}
          >
            Next
          </button>
        </div>
        <div className="queue-time-wrapper">
          <label htmlFor="queue-time">Queue Time - {queueTime}</label>
          <input
            id="queue-time"
            type="range"
            min="0"
            max="4000"
            step="200"
            required
            value={queueTime}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              setQueueTime(isNaN(value) || value < 0 ? 0 : value);
            }}
          />
        </div>
      </header>
      <section>
        <ul className="ball-list" ref={wrapperRef}>
          <animated.li className="ball ball--green" style={animationProps}>
            {step + 1}
          </animated.li>
          <li className="ball ball--red ball__first-step" ref={stepOneRef}>
            1
          </li>
          <li className="ball ball--red ball__second-step" ref={stepTwoRef}>
            2
          </li>
          <li className="ball ball--red ball__third-step" ref={stepThreeRef}>
            3
          </li>
          <li className="ball ball--red ball__fourth-step" ref={stepFourRef}>
            4
          </li>
          <li className="ball ball--red ball__fifth-step" ref={stepFiveRef}>
            5
          </li>
        </ul>
      </section>
    </main>
  );
};
export default App;
