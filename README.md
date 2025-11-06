# Latency Topology Visualizer

A Next.js application that displays a 3D world map visualizing cryptocurrency exchange server locations and real-time/historical latency data across AWS, GCP, and Azure co-location regions.

## Features

### Core Functionality

1. **3D World Map Display**

   - Interactive 3D globe rendered with Three.js
   - Smooth camera controls (rotate, zoom, pan)
   - Real-time rendering with optimized performance

2. **Exchange Server Locations**

   - Visual markers for major cryptocurrency exchanges (OKX, Deribit, Bybit, Binance, Coinbase, Kraken, BitMEX)
   - Color-coded by cloud provider (AWS: Orange, GCP: Blue, Azure: Cyan)
   - Hover tooltips with exchange information
   - Click to select exchanges for comparison

3. **Real-time Latency Visualization**

   - Animated connections between exchanges and cloud regions
   - Color-coded latency ranges:
     - Green: Low latency (<50ms)
     - Yellow: Medium latency (50-100ms)
     - Red: High latency (>100ms)
   - Updates every 5 seconds with simulated latency data

4. **Historical Latency Trends**

   - Time-series charts showing historical latency between selected exchanges
   - Time range selectors (1 hour, 24 hours, 7 days, 30 days)
   - Statistics display (min, max, average latency)
   - Interactive chart with tooltips

5. **Cloud Provider Regions**

   - Visualization of AWS, GCP, and Azure regions
   - Distinct visual styling for each provider
   - Filterable by cloud provider

6. **Interactive Controls**

   - Search functionality for exchanges
   - Filter by cloud provider
   - Toggle visualization layers (real-time, historical, regions)
   - Performance metrics dashboard
   - Dark/light theme toggle

7. **Responsive Design**
   - Optimized for desktop and mobile devices
   - Touch controls for mobile interaction
   - Adaptive UI layout

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Charts**: Recharts
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd goquant
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
goquant/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── WorldMap3D.tsx    # 3D map visualization
│   ├── ControlPanel.tsx   # Control panel with filters
│   ├── HistoricalChart.tsx # Historical latency chart
│   └── PerformanceMetrics.tsx # Performance dashboard
├── data/                  # Static data
│   ├── exchanges.ts      # Exchange locations
│   └── cloudRegions.ts   # Cloud provider regions
├── hooks/                 # Custom React hooks
│   └── useLatencyUpdates.ts # Real-time latency updates
├── lib/                   # Utility functions
│   └── latencySimulator.ts # Latency data generation
├── store/                 # State management
│   └── useAppStore.ts    # Zustand store
└── types/                 # TypeScript types
    └── index.ts          # Type definitions
```

## Usage

### Interacting with the 3D Map

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel or pinch gesture
- **Select Exchange**: Click on an exchange marker
- **Compare Exchanges**: Click a second exchange to view historical latency comparison
- **View Details**: Hover over markers to see information

### Controls Panel

- **Search**: Type to filter exchanges by name
- **Cloud Provider Filter**: Select AWS, GCP, Azure, or All
- **Visualization Layers**: Toggle real-time latency, historical trends, and cloud regions
- **Data Source**: Toggle between Cloudflare Radar (real-time) and simulated data
- **Time Range**: Select historical data time range (1h, 24h, 7d, 30d)
- **Theme Toggle**: Switch between light and dark modes

## Data Sources

The application supports **real-time latency data from Cloudflare Radar API** with automatic fallback to simulated data:

### Real-time Data (Cloudflare Radar)

- Uses Cloudflare Radar's quality/speed/summary endpoint
- Fetches real network latency metrics by country
- Updates every 10 seconds
- Automatically falls back to simulated data if API is unavailable

### Simulated Data (Fallback)

- Geographic distance calculation (Haversine formula)
- Base latency calculation (5ms per 1000km + 10ms base)
- Time-based variations to simulate network patterns
- Random variations for realistic data

### Configuration

To use Cloudflare Radar API (optional):

1. Some endpoints work without authentication
2. For advanced features, add your API key to `.env.local`:
   ```
   CLOUDFLARE_API_KEY=your_api_key_here
   ```
3. Get your API key from: https://dash.cloudflare.com/profile/api-tokens

You can toggle between real-time and simulated data using the "Data Source" toggle in the control panel.
