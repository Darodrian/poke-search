# 🔍 Pokédex Search

A modern, interactive Pokémon search application built with React and Redux Toolkit. Search for any Pokémon by name or ID number and explore detailed information including stats, abilities, sprites, and more.

## 📖 Description

Pokédex Search is a web application that allows users to search and explore information about Pokémon from the official PokéAPI. The app features:

- **Smart Search with Autocomplete**: Search for any Pokémon by name or ID with real-time suggestions and keyboard navigation
- **Detailed Information**: View comprehensive Pokémon data including:
  - Multiple sprite views (front, back, shiny variants)
  - Type information with color-coded badges and type effectiveness (offensive/defensive)
  - Base stats with visual progress bars
  - Calculated stats at different levels (1-100)
  - Evolution chain display
  - Physical attributes (height, weight, base experience)
  - Gender ratio
  - Abilities (including hidden abilities)
  - Pokédex description (genus & flavor text)
  - Pokémon cry playback
- **Level Calculator**: Adjust Pokémon level from 1-100 to see how stats change
- **Modern UI**: Dark-themed interface with Bootstrap styling

## 🚀 Live Demo

Check out the live application: [https://poke-search-five.vercel.app/](https://poke-search-five.vercel.app/)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd poke-search
```

2. Install dependencies:
```bash
npm install
```
or
```bash
yarn install
```

3. Start the development server:
```bash
npm start
```
or
```bash
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Available Scripts

- `npm start` or `yarn start` - Runs the app in development mode
- `npm test` or `yarn test` - Launches the test runner
- `npm run build` or `yarn build` - Builds the app for production
- `npm run eject` or `yarn eject` - Ejects from Create React App (one-way operation)

## 🛠️ Technologies Used

- **React** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **Bootstrap** - CSS framework
- **PokéAPI** - Pokémon data source

## 📝 Features

- Real-time Pokémon search with autocomplete suggestions
- Smart type effectiveness charts (offensive & defensive)
- Evolution chain viewer
- Pokémon cry audio playback
- Gender ratio display
- Dynamic stat calculation based on level
- Responsive design
- Error handling for invalid searches
- Loading states and animations
