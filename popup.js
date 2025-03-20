document.getElementById('save').addEventListener('click', () => {
    const threshold = parseFloat(document.getElementById('threshold').value);
    if (!isNaN(threshold) && threshold >= 0) {
      chrome.storage.sync.set({ discountThreshold: threshold }, () => {
        alert(`Threshold set to ${threshold}%`);
        window.close(); // Close popup after saving
      });
    } else {
      alert('Please enter a valid number >= 0');
    }
  });
  
  // Load the current threshold when popup opens
  chrome.storage.sync.get(['discountThreshold'], (result) => {
    if (result.discountThreshold !== undefined) {
      document.getElementById('threshold').value = result.discountThreshold;
    }
  });