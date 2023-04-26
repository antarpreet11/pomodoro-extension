import React from 'react'
import '../css/timerprogress.css'

const TimerProgress = (props) => {
    const progressBarStyle = {
        width: `${(parseInt(props.timerValue.split(':')[1]) / 60) * 100}%`
      };

  return (
    <div className="timer-progress">
        <div className="progress-bar" style={progressBarStyle}>
            <div className="progress-bar-text">{props.timerValue}m</div>
        </div>
    </div>
  )
}

export default TimerProgress