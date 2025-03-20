let isActivated = false;
const seenItems = new Set();
let discountThreshold = 2; // Default threshold (-2%)

function checkForDiscounts() {
  console.clear();
  if (!isActivated) {
    console.log("Waiting for user interaction to start checking discounts");
    return;
  }

  const discountElements = document.querySelectorAll('.size-small.px-xs.ellipsis');
  console.log(`Found ${discountElements.length} potential discount elements`);

  discountElements.forEach(element => {
    const discountText = element.textContent.trim();
    console.log(`Discount text: "${discountText}"`);

    const discountValue = parseFloat(discountText.replace('%', ''));
    console.log(`Parsed discount value: ${discountValue}`);

    if (!isNaN(discountValue) && discountValue <= -discountThreshold) {
      if (!seenItems.has(discountText)) {
        console.log(`Discount ${discountValue}% detected - playing sound (threshold: -${discountThreshold}%)`);
        seenItems.add(discountText);
        const audio = new Audio(chrome.runtime.getURL("notification.wav"));
        audio.play()
          .then(() => console.log("Sound played successfully"))
          .catch(error => console.error("Error playing sound:", error));
      } else {
        console.log(`Discount ${discountValue}% already triggered - skipping`);
      }
    } else {
      console.log(`Discount ${discountValue}% does not meet threshold (-${discountThreshold}%) or is invalid`);
    }
  });
}

// Load threshold from storage and update dynamically
chrome.storage.sync.get(['discountThreshold'], (result) => {
  if (result.discountThreshold !== undefined) {
    discountThreshold = result.discountThreshold;
    console.log(`Loaded threshold from storage: -${discountThreshold}%`);
  }
});

// Listen for threshold changes in real-time
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.discountThreshold) {
    discountThreshold = changes.discountThreshold.newValue;
    console.log(`Threshold updated to -${discountThreshold}%`);
  }
});

// Start checking only after user interaction
document.addEventListener('click', () => {
  if (!isActivated) {
    console.log("User interacted - starting discount checks");
    isActivated = true;
    checkForDiscounts(); // Run immediately on first interaction
    setInterval(checkForDiscounts, 5000); // Then every 5 seconds
  }
});

// Initial log to inform user
console.log("Click anywhere on the page to enable discount notifications");