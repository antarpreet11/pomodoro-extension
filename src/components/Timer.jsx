import React, { useState, useEffect } from 'react';
import '../css/timer.css';
import TimerProgress from './TimerProgress.jsx';

const Timer = () => {
    const [timerValue, setTimerValue] = useState('00:00');
    const [isRunning, setIsRunning] = useState(false);

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
          if (request.type === "timerValue") {
            const seconds = request.value;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            setTimerValue(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`);
            if (request.value > 0 && !isRunning) {
                setIsRunning(true);
            }
          }
      }
    );

    const startTimer = async () => {
      setIsRunning(true);
      const response = await chrome.runtime.sendMessage({ type: "startTimer" });
      console.log(response);
    }

    const stopTimer = async () => {
      setIsRunning(false);
      const response = await chrome.runtime.sendMessage({ type: "stopTimer" });
      console.log(response)
    }

    const resetTimer = async () => {
      setTimerValue('00:00');
      setIsRunning(false);
      const response = await chrome.runtime.sendMessage({ type: "resetTimer" });
      console.log(response);
    }


    const stoppedTimeGetter = async () => {
      const data = await chrome.storage.local.get(["time"]);
      if (data.time) {
        const seconds = data.time;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        setTimerValue(`${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`);
      }
    }

    useEffect(() => {
      stoppedTimeGetter();
    }, []);
    console.log();

  return (
    <div className="popup">
      <TimerProgress timerValue={timerValue}></TimerProgress>
      <div className="timer-controls">
        {!isRunning && (
          <button className="start-button" onClick={startTimer}>
            Start
          </button>
        )}
        {isRunning && (
          <button className="stop-button" onClick={stopTimer}>
            Stop
          </button>
        )}
        <button className="reset-button" onClick={resetTimer}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
