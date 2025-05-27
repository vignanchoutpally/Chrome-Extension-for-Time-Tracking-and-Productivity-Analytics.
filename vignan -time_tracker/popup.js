// DOM Elements
const productivityScore = document.getElementById('productivity-score');
const productivityBar = document.getElementById('productivity-bar');
const productiveTime = document.getElementById('productive-time');
const unproductiveTime = document.getElementById('unproductive-time');
const tabs = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.view');
let weeklyChart = null;

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  updateTodayStats();
  setupTabNavigation();
  setupWeeklyChart();
});

// Setup tab navigation
function setupTabNavigation() {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Show selected view
      views.forEach(v => {
        v.style.display = v.id === `${view}-view` ? 'block' : 'none';
      });
      
      // Load view data
      switch(view) {
        case 'today':
          updateTodayStats();
          break;
        case 'week':
          updateWeeklyStats();
          break;
        case 'sites':
          updateTopSites();
          break;
      }
    });
  });
}

// Format time duration in hours and minutes
function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

// Update today's statistics
async function updateTodayStats() {
  const date = new Date().toISOString().split('T')[0];
  const data = await chrome.storage.local.get(['dailyStats']);
  const todayStats = data.dailyStats?.[date] || { productive: 0, unproductive: 0, neutral: 0 };
  
  const total = todayStats.productive + todayStats.unproductive + todayStats.neutral;
  const score = total > 0 ? Math.round((todayStats.productive / total) * 100) : 0;
  
  productivityScore.textContent = `${score}%`;
  productivityBar.style.width = `${score}%`;
  productiveTime.textContent = formatTime(todayStats.productive);
  unproductiveTime.textContent = formatTime(todayStats.unproductive);
}

// Setup and update weekly chart
async function setupWeeklyChart() {
  const ctx = document.getElementById('weekly-chart').getContext('2d');
  
  // Create gradient for productive data
  const productiveGradient = ctx.createLinearGradient(0, 0, 0, 400);
  productiveGradient.addColorStop(0, 'rgba(74, 222, 128, 0.8)');
  productiveGradient.addColorStop(1, 'rgba(34, 197, 94, 0.2)');
  
  // Create gradient for unproductive data
  const unproductiveGradient = ctx.createLinearGradient(0, 0, 0, 400);
  unproductiveGradient.addColorStop(0, 'rgba(248, 113, 113, 0.8)');
  unproductiveGradient.addColorStop(1, 'rgba(239, 68, 68, 0.2)');

  weeklyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Productive',
          backgroundColor: productiveGradient,
          borderColor: '#22c55e',
          borderWidth: 2,
          borderRadius: 8,
          data: []
        },
        {
          label: 'Unproductive',
          backgroundColor: unproductiveGradient,
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 8,
          data: []
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            font: {
              family: 'Roboto',
              size: 12
            },
            color: '#6b7280'
          },
          title: {
            display: true,
            text: 'Hours',
            font: {
              family: 'Roboto',
              size: 14,
              weight: '500'
            },
            color: '#4b5563'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: 'Roboto',
              size: 12
            },
            color: '#6b7280'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'Roboto',
              size: 13,
              weight: '500'
            },
            usePointStyle: true,
            padding: 20
          }
        },
        title: {
          display: true,
          text: 'Weekly Productivity',
          font: {
            family: 'Roboto',
            size: 16,
            weight: '600'
          },
          color: '#1f2937',
          padding: {
            top: 20,
            bottom: 20
          }
        }
      }
    }
  });
  
  updateWeeklyStats();
}

// Update weekly statistics
async function updateWeeklyStats() {
  const data = await chrome.storage.local.get(['dailyStats']);
  const dailyStats = data.dailyStats || {};
  
  // Get last 7 days
  const dates = [];
  const productive = [];
  const unproductive = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const stats = dailyStats[dateStr] || { productive: 0, unproductive: 0 };
    
    dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    productive.push(stats.productive / (1000 * 60 * 60)); // Convert to hours
    unproductive.push(stats.unproductive / (1000 * 60 * 60));
  }
  
  weeklyChart.data.labels = dates;
  weeklyChart.data.datasets[0].data = productive;
  weeklyChart.data.datasets[1].data = unproductive;
  weeklyChart.update();
}

// Update top sites list
async function updateTopSites() {
  const data = await chrome.storage.local.get(['websiteData']);
  const websiteData = data.websiteData || {};
  const topSitesList = document.getElementById('top-sites-list');
  
  // Sort sites by total time
  const sortedSites = Object.entries(websiteData)
    .sort(([, a], [, b]) => b.totalTime - a.totalTime)
    .slice(0, 10);
  
  // Create HTML for top sites
  const sitesHTML = sortedSites.map(([domain, data]) => `
    <div class="stat-item">
      <div>
        <div>${domain}</div>
      </div>
      <div>
        <div>${formatTime(data.totalTime)}</div>
        <small>${data.visits} visits</small>
      </div>
    </div>
  `).join('');
  
  topSitesList.innerHTML = sitesHTML || '<div class="stat-item">No data available</div>';
} 