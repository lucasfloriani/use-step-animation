# use-step-animation

> Custom hook used to make sequence of animations using positions more easily

[![NPM](https://img.shields.io/npm/v/use-step-animation.svg)](https://www.npmjs.com/package/use-step-animation) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install use-step-animation
yarn add use-step-animation
```

## Usage

```tsx
import * as React from "react";
import { animated } from "react-spring";
import { useStepAnimation } from "use-step-animation";

const Example = () => {
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
    queueTime: 1000,
    getPositionsAwaitTime: 0,
  });

  return (
    <main className="content">
      <header className="header">
        <div className="header__actions">
          <button className="button" onClick={previousStep}>
            Previous
          </button>
          <button className="button" onClick={nextStep}>
            Next
          </button>
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
```

## License

MIT © [lucasfloriani](https://github.com/lucasfloriani)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
