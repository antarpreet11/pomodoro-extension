let timerValue = 0;
let timerInterval = null;

const updateTimer = () => {
  timerValue++;
  chrome.storage.local.set({ time : timerValue });
  try {
    chrome.runtime.sendMessage({ type: "timerValue", value: timerValue });
  } catch (error) {
    console.log("Error: ", error);
  }
}

const startTimer = () => {
  timerInterval = setInterval(updateTimer, 1000);
}

const stopTimer = () => {
  clearInterval(timerInterval);
}

const resetTimer = () => {
  timerValue = 0;
  stopTimer();
  chrome.storage.local.set({ time : 0 });
  chrome.runtime.sendMessage({ type: "timerValue", value: timerValue });
}

// Send stopped time to popup.js not working
const sendStoppedTime = () => {
  chrome.runtime.sendMessage({ type: "stoppedTime", value: timerValue });
}

chrome.runtime.onMessage.addListener(function(message) {
  if (message.type === "startTimer") {
    startTimer();
    chrome.runtime.sendResponse({executed: "startTimer"});
  } else if (message.type === "stopTimer") {
    stopTimer();
    chrome.runtime.sendResponse({executed: "stopTimer"});
  } else if (message.type === "resetTimer") {
    resetTimer();
    chrome.runtime.sendResponse({executed: "resetTimer"});
  } else if (message.type === "stoppedTimeGetter") {
    sendStoppedTime();
  }else {
    console.log(message);
    }
});

