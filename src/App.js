import { useEffect, useRef, useState } from "react";
import "./styles.css";

export const formatSecondsToMinutes = (time) => {
  let secondText = "second";
  let secondsText = "seconds";
  let minuteText = "minute";
  let minutesText = "minutes";

  secondsText = `${secondText}s`;

  minutesText = `${minuteText}s`;

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  if (time < 60) {
    return `${time} ${secondsText}`;
  }

  if (seconds === 0) {
    return `${minutes} ${minutes > 1 ? minutesText : minuteText}`;
  }

  const secondsValue = seconds > 1 ? secondsText : secondText;

  return `${minutes} ${
    minutes > 1 ? minutesText : minuteText
  } ${seconds} ${secondsValue}`;
};

const updateIntervalGap = 20;

const useAccessibleScreenReaderTimeCounter = (timer) => {
  const [{ ariaLive, ariaAtomic }, setAriaValue] = useState({
    ariaLive: "off",
    ariaAtomic: "false"
  });

  useEffect(() => {
    if (timer % updateIntervalGap === 0) {
      setAriaValue({ ariaLive: "polite", ariaAtomic: "true" });
    } else if (timer % updateIntervalGap === 1) {
      setAriaValue({ ariaLive: "off", ariaAtomic: "false" });
    }
  }, [timer]);

  const label = formatSecondsToMinutes(timer);
  return { role: "timer", label, ariaLive, ariaAtomic };
};

export default function App() {
  const [timer, setTimer] = useState(150);
  const timerRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const {
    ariaAtomic,
    role,
    label,
    ariaLive
  } = useAccessibleScreenReaderTimeCounter(timer);

  const onClick = () => {
    setIsStarted(true);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };

  const onStop = () => {
    setIsStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setTimer(180);
    }
  };

  return (
    <div className="App">
      <div
        role={role}
        aria-live={ariaLive}
        aria-atomic={ariaAtomic}
        style={{ padding: "30px", minWidth: "200px" }}
        aria-label={`${label} left`}
      >
        <span aria-hidden>{label}</span>
      </div>
      <hr />
      <button disabled={isStarted} style={{ margin: "10px" }} onClick={onClick}>
        Start
      </button>
      <button disabled={!isStarted} style={{ margin: "10px" }} onClick={onStop}>
        Stop
      </button>
    </div>
  );
}
