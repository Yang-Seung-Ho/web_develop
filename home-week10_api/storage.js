export function saveData(key, value) {
    chrome.storage.local.set({ [key]: value });
  }
  
  export function getData(key, callback) {
    chrome.storage.local.get(key, (result) => {
      callback(result[key]);
    });
  }
  