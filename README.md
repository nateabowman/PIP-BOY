# Pip-Boy Web App

A mobile-friendly Progressive Web App (PWA) that replicates the Fallout Pip-Boy interface with authentic animations, real-life stat tracking, and full functionality.

## Features

- **STAT Tab**: Real-time stats including time, date, location, steps, calories, weather, battery, and network status
- **INVENTORY Tab**: Track items with categories, weight, value, and condition
- **DATA Tab**: Notes and holotapes system for storing information
- **MAP Tab**: Interactive map with location tracking and saved locations
- **RADIO Tab**: Music player interface with visualizer
- **QUESTS Tab**: Task/quest management with progress tracking
- **APPAREL Tab**: Clothing and outfit tracker

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## PWA Installation

### iOS (iPhone/iPad)

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear as a standalone app

### Android

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be installed as a PWA

## Technologies

- React 18
- TypeScript
- Vite
- Leaflet (for maps)
- IndexedDB (for data persistence)
- Web APIs (Geolocation, Battery, Device Motion)

## Browser Support

- Chrome/Edge (latest)
- Safari (iOS 11.3+)
- Firefox (latest)

## Notes

- Weather data requires an OpenWeatherMap API key (currently using demo key)
- Location services require user permission
- Some features (battery, device motion) may not be available on all devices

## License

MIT

