import React, { useState, useEffect } from 'react';
import './timer.css';

const Timer = () => {
    const [timerValue, setTimerValue] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
          if (request.type === "timerValue") {
              setTimerValue(request.value);
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
      setTimerValue(0);
      setIsRunning(false);
      const response = await chrome.runtime.sendMessage({ type: "resetTimer" });
      console.log(response);
    }

    const progressBarStyle = {
      width: `${(timerValue / 60) * 100}%`
    };

    const stoppedTimeGetter = async () => {
      const data = await chrome.storage.local.get(["time"]);
      console.log("Stored time: %o", data.time);
      if (data.time) {
        setTimerValue(data.time);
      }
    }

    useEffect(() => {
      stoppedTimeGetter();
    }, []);

  return (
    <div className="popup">
      <div className="timer-progress">
        <div className="progress-bar" style={progressBarStyle}>
          <div className="progress-bar-text">{timerValue}s</div>
        </div>
      </div>
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
        <div>{timerValue}</div>
      </div>
    </div>
  );
}

export default Timer;
