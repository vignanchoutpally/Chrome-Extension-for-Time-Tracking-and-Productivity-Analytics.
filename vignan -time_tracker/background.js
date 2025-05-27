// Website categories
const websiteCategories = {
  productive: [
    'github.com',
    'stackoverflow.com',
    'leetcode.com',
    'docs.google.com',
    'notion.so'
  ],
  unproductive: [
    'facebook.com',
    'instagram.com',
    'twitter.com',
    'reddit.com',
    'youtube.com'
  ]
};

// Track active tab and timing data
let activeTabId = null;
let startTime = null;
let isTracking = false;
let lastSavedTime = Date.now();

// Initialize data structure when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed - initializing data structures');
  chrome.storage.local.set({
    websiteData: {},
    dailyStats: {},
    weeklyStats: {}
  });
  startTracking();
});

// Start tracking
function startTracking() {
  isTracking = true;
  checkCurrentTab();
  // Check active tab every 5 seconds
  setInterval(checkCurrentTab, 5000);
}

// Check current tab and update time
async function checkCurrentTab() {
  if (!isTracking) return;

  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    
    if (!currentTab || !currentTab.url || currentTab.url.startsWith('chrome://')) {
      console.log('Invalid tab or chrome URL, skipping...');
      return;
    }

    const currentTime = Date.now();
    const domain = new URL(currentTab.url).hostname;

    // If tab changed
    if (currentTab.id !== activeTabId) {
      if (activeTabId && startTime) {
        // Save time for previous tab
        const duration = currentTime - startTime;
        if (duration >= 1000) {
          await saveTimeData(domain, duration);
        }
      }
      // Start tracking new tab
      activeTabId = currentTab.id;
      startTime = currentTime;
      lastSavedTime = currentTime;
      console.log('Started tracking:', domain);
    } else {
      // Same tab, update time if enough time has passed
      const duration = currentTime - lastSavedTime;
      if (duration >= 5000) { // Save every 5 seconds
        await saveTimeData(domain, duration);
        lastSavedTime = currentTime;
      }
    }
  } catch (error) {
    console.error('Error in checkCurrentTab:', error);
  }
}

// Save timing data
async function saveTimeData(domain, duration) {
  try {
    const category = getWebsiteCategory(domain);
    const date = new Date().toISOString().split('T')[0];
    
    console.log(`Saving time for ${domain}: ${formatTime(duration)} (${category})`);
    
    // Get existing data
    const data = await chrome.storage.local.get(['websiteData', 'dailyStats']);
    const websiteData = data.websiteData || {};
    const dailyStats = data.dailyStats || {};
    
    // Update website specific data
    if (!websiteData[domain]) {
      websiteData[domain] = {
        totalTime: 0,
        category: category,
        visits: 0
      };
    }
    websiteData[domain].totalTime += duration;
    websiteData[domain].visits += 1;
    
    // Update daily statistics
    if (!dailyStats[date]) {
      dailyStats[date] = {
        productive: 0,
        unproductive: 0,
        neutral: 0
      };
    }
    dailyStats[date][category] += duration;
    
    // Save updated data
    await chrome.storage.local.set({
      websiteData: websiteData,
      dailyStats: dailyStats
    });
    
    // Update badge with today's productive time percentage
    updateProductivityBadge(dailyStats[date]);
    
    console.log('Data saved successfully');
  } catch (error) {
    console.error('Error saving time data:', error);
  }
}

// Format time for logging
function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `${minutes}m ${seconds}s`;
}

// Determine website category
function getWebsiteCategory(domain) {
  if (websiteCategories.productive.some(site => domain.includes(site))) {
    return 'productive';
  } else if (websiteCategories.unproductive.some(site => domain.includes(site))) {
    return 'unproductive';
  }
  return 'neutral';
}

// Update extension badge with productivity percentage
function updateProductivityBadge(todayStats) {
  const total = todayStats.productive + todayStats.unproductive + todayStats.neutral;
  if (total > 0) {
    const productivePercentage = Math.round((todayStats.productive / total) * 100);
    chrome.action.setBadgeText({ text: `${productivePercentage}%` });
    chrome.action.setBadgeBackgroundColor({ color: productivePercentage >= 50 ? '#4CAF50' : '#F44336' });
  }
}

// Set up daily stats reset
chrome.alarms.create('resetDailyStats', {
  periodInMinutes: 1440 // 24 hours
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetDailyStats') {
    const date = new Date().toISOString().split('T')[0];
    chrome.storage.local.get(['dailyStats'], (data) => {
      const dailyStats = data.dailyStats || {};
      dailyStats[date] = {
        productive: 0,
        unproductive: 0,
        neutral: 0
      };
      chrome.storage.local.set({ dailyStats });
    });
  }
}); 