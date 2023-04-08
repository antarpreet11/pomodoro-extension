(() => {
  let timerBoxes = document.getElementsByClassName("timer-box-pomodummy");
  let timerBox = timerBoxes ? timerBoxes[0] : null;
  if (!timerBox) {
    timerBox = document.createElement("div");
    timerBox.className = "timer-box-pomodummy";
    document.body.appendChild(timerBox);
  }
  timerBox.addEventListener("click", () => {
    timerBox.remove();
  });
  
  chrome.runtime.onMessage.addListener(
    (request) => {
        if (request.type === "timerValue") {
          const seconds = request.value;
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = seconds % 60;
          timerBox.innerText = `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
        }
    }
  );
})();