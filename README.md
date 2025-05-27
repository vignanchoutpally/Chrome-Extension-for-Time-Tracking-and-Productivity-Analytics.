# ⏱️ Vignan Time Tracker

A simple and elegant Chrome extension to **track your time spent on websites**, helping you **analyze productivity** and develop **better browsing habits**.

## 🚀 Features

- 🧠 **Productivity Scoring** – Instantly see how productive your current session is with a clear percentage-based score.
- ⏳ **Time Tracking** – Automatically tracks time spent on productive and unproductive websites.
- 📊 **Visual Analytics** – View your daily and weekly activity with intuitive charts.
- 🌐 **Top Sites View** – See which websites consume the most of your time.
- 🎯 **Clean UI** – Beautifully designed interface with tab-based navigation and categorized stats.

## 📸 UI Preview

<img width="1470" alt="Image" src="https://github.com/user-attachments/assets/327c604f-9202-4187-a6c0-67af1ed1b53f" />
<img width="591" alt="Image" src="https://github.com/user-attachments/assets/b2494aa6-1381-4a4f-9b6a-5317116439b7" />
<img width="588" alt="Image" src="https://github.com/user-attachments/assets/8aaafa4f-bd2c-4f99-b7c6-3f83c1d5340c" />
*Track, analyze, and optimize your web time effortlessly.*

## 🛠️ Tech Stack

- Manifest V3
- HTML, CSS (with gradients and shadows for sleek visuals)
- JavaScript (Modular structure with `popup.js`, `chart.js`, and `background.js`)
- Chart.js for dynamic weekly analysis

## 🔒 Permissions

This extension requires the following Chrome permissions:

- `tabs`, `activeTab`, `webNavigation`, `storage`, `alarms`, `windows`
- `<all_urls>` (to monitor browsing activity)

## 📁 Project Structure
```
vignan-time-tracker/
│
├── background.js       # Handles time tracking in background
├── chart.js            # Handles rendering productivity charts
├── popup.html          # Frontend popup interface
├── popup.js            # Logic for switching views and updating stats
├── manifest.json       # Chrome extension configuration
├── icons/              # Extension icons
└── README.md           # You're here
```

## 📦 Installation

1. Clone or download this repository.
2. Open **chrome://extensions** in your browser.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the project folder.

## ⚙️ Usage

1. Click the extension icon in your Chrome toolbar.
2. Navigate through the "Today", "This Week", or "Top Sites" tabs.
3. Track your productivity score, total time spent, and browse top website insights.

## 📌 Future Enhancements

- User-defined productivity categories
- Exporting time logs to CSV
- Notifications for excessive unproductive time

---

> 💡 Built with a mission to help students and professionals become more mindful of their time online.
