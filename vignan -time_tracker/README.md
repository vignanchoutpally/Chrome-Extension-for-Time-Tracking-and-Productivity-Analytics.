# Productivity Time Tracker Chrome Extension

A Chrome extension that helps you track and analyze your time spent on different websites, categorizing them as productive or unproductive to help you improve your online productivity.

## Features

- Real-time website tracking
- Automatic website categorization (productive vs. unproductive)
- Daily and weekly productivity statistics
- Visual analytics with charts
- Top visited sites analysis
- Productivity score calculation
- Clean and intuitive user interface

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon to view your productivity dashboard
2. Navigate between different views using the tabs:
   - Today: View your current day's productivity statistics
   - Week: See your productivity trends over the past week
   - Sites: Analyze your most visited websites and their categories

3. The extension will automatically track your browsing and categorize websites as:
   - Productive (e.g., development sites, documentation, learning platforms)
   - Unproductive (e.g., social media, entertainment)
   - Neutral (uncategorized sites)

## Customization

You can customize the website categories by modifying the `websiteCategories` object in `background.js`. Add or remove domains to change how websites are categorized.

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- You can clear the data at any time through Chrome's extension settings

## Development

To modify or enhance the extension:

1. Make your changes to the source files
2. Reload the extension in `chrome://extensions/`
3. Test your changes

## License

MIT License - Feel free to modify and distribute this code as needed.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests. 