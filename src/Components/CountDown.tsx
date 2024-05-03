//

import { useEffect, useState } from "react";

const CountDown = ({
  seconds,
  onCountEnd,
}: {
  seconds: number;
  onCountEnd?: any;
}) => {
  let [currentTime, setCurrentTime] = useState<number>(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.max(currentTime - 1, 0));
    }, 1000);

    if (currentTime === 0) {
      onCountEnd();
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [currentTime]);

  return <div className="text-slate-700">{currentTime.toString()}</div>;
};

export default CountDown;
