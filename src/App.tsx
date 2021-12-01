import React, { useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import './App.css';


const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [status, setStatus] = useState('not-ticking');

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

  const handleStart = () => {
    setTimerOn(prevTimerState => !prevTimerState);
    setStatus('ticking');
  }

  const handleStop = () => {
    setTime(0);
    setTimerOn(false);
    setStatus('not-ticking');
  }

  const handleReset = () => {
    if (timerOn && status === 'ticking') {
      handleStop();
      handleStart();
    }
  }

  const oneSec = time / 1000;

  const formatTime = (durationInSeconds: number) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds - hours * 3600 - minutes * 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="App">
      <span
        className="Time"
      >
        {formatTime(oneSec)}
      </span>
      <div>
        {status === 'not-ticking' && (
          <button
            type="button"
            onClick={handleStart}
            className="Button"
          >
            Start
          </button>
        )}
        {status === 'ticking' && (
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
          onClick={handleReset}
          className="Button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
