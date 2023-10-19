import { useEffect, useState } from 'react';

import throttle from 'lodash.throttle';

import { keys } from '@/util/object.util';

const findKeyByValue = <K, T extends Record<string, K>>(object: T, value: K) =>
  keys(object).find((key) => object[key] === value) as keyof T;

const getDeviceConfig = (width: number) => {
  const screens = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  const bpSizes = keys(screens).map((screenSize) => screens[screenSize]);

  const bpShapes = bpSizes.map((size, index) => ({
    min: !index ? 0 : bpSizes[index - 1],
    max: size,
    key: findKeyByValue(screens, size),
  }));

  let breakpoint = findKeyByValue(screens, Math.max(...Object.values(screens)));

  bpShapes.forEach((shape) => {
    if (!shape.min && width < shape.max) {
      breakpoint = shape.key;
    } else if (width >= shape.min && width < shape.max) {
      breakpoint = shape.key;
    } else if (!shape.max && width >= shape.max) {
      breakpoint = shape.key;
    }
  });

  return breakpoint;
};

const useTailwindBreakpoint = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;

  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(width));

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBrkPnt(getDeviceConfig(window.innerWidth));
    }, 200);

    window.addEventListener('resize', calcInnerWidth);

    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return brkPnt;
};

export default useTailwindBreakpoint;
