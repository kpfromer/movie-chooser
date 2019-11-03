import React, { useRef, useEffect } from 'react';
import bounty from 'bounty';

export interface OdometerProps {
  pause?: boolean;
}

const Odometer: React.FC<OdometerProps> = ({ pause = false }) => {
  const element = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    if (element.current !== null && !pause) {
      bounty({
        el: element.current,
        value: '£42,000,000',
        initialValue: '£900,000',
        lineHeight: 1.35,
        letterSpacing: 1,
        animationDelay: 100,
        letterAnimationDelay: 100
      });
    }
  }, [pause]);
  return <div ref={element}>{pause ? '£900,000' : ''}</div>;
};

export default Odometer;
