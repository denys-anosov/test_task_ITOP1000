import React, { useCallback, useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import './App.css';


const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [isWaitClicked, setIsWaitClicked] = useState(false);

  useEffect(() => {
    const unsub = new Subject();

    interval(1000)
      .pipe(takeUntil(unsub))
      .subscribe(() => {
        if (timerOn) {
          setTime(prevTime => prevTime + 1000)
        }
      });

    return () => {
      unsub.next(0);
      unsub.complete();
    };
  }, [timerOn]);

  const handleStart = useCallback(() => {
    setTimerOn(prevTimerState => !prevTimerState);
  }, [])


  const handleStop = useCallback(() => {
    setTime(0);
    setTimerOn(false);
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    handleStart();
  }, [handleStart, handleStop]);

  const handleWait = useCallback(() => {
    if (isWaitClicked) {
      setTimerOn(false);
    } else if (!isWaitClicked) {
      setIsWaitClicked(true);
      setTimeout(() => setIsWaitClicked(false), 300);
    }
  }, [isWaitClicked]);


  const oneSec = time / 1000;

  const formatTime = useCallback((durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds - hours * 3600 - minutes * 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }, []);

  return (
    <div className="App">
      <span
        className="Time"
      >
        {formatTime(oneSec)}
      </span>
      <div>
        {!timerOn && (
          <button
            type="button"
            onClick={handleStart}
            className="Button"
          >
            Start
          </button>
        )}
        {timerOn && (
          <button
            type="button"
            onClick={handleStop}
            className="Button"
          >
            Stop
          </button>
        )}
        <button
          type="button"
          className="Button"
          onClick={handleWait}
        >
          Wait
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="Button"
        >
          Reset
        </button>
      </div>
      <p>Status: {timerOn ? 'ON' : 'OFF'}</p>
    </div>
  );
}

export default App;
