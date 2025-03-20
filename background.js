chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "playSound") {
      console.log("Background script received playSound message");
      const audio = new Audio(chrome.runtime.getURL("notification.wav"));
      console.log("Attempting to play notification.wav");
      audio.play()
        .then(() => console.log("Sound played successfully"))
        .catch(error => console.error("Error playing sound:", error));
    }
  });