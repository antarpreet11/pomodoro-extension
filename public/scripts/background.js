let timerValue = 0;
let timerInterval = null;
let currentTabId = null;

const getCurrentTab = async () => { 
  const [newTab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  currentTabId = newTab.id;
}

const updateTimer = () => {
  timerValue++;
  chrome.storage.local.set({ time : timerValue });
  chrome.runtime.sendMessage({ type: "timerValue", value: timerValue });
  chrome.tabs.sendMessage(currentTabId, { type: "timerValue", value: timerValue });
}

const startTimer = () => {
  getCurrentTab();
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
  chrome.tabs.sendMessage(currentTabId, { type: "timerValue", value: timerValue });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  currentTabId = tabId;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "startTimer") {
    startTimer();
    sendResponse({executed: "startTimer"});
  } else if (message.type === "stopTimer") {
    stopTimer();
    sendResponse({executed: "stopTimer"});
  } else if (message.type === "resetTimer") {
    resetTimer();
    sendResponse({executed: "resetTimer"});
  } 
});

