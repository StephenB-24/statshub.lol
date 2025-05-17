import { useState } from 'react'
import './App.css'

type Site = {
  name: string
  url: string
}

const sites: Site[] = [
  { name: 'u.gg', url: 'https://u.gg/lol/tier-list' },
  { name: 'deeplol.gg', url: 'https://deeplol.gg' },
  { name: 'op.gg', url: 'https://www.op.gg' },
]

const PROXY_SERVER = import.meta.env.VITE_PROXY_URL || 'http://localhost:3000';
function getProxyUrl(originalUrl: string): string {
  const url = new URL(originalUrl);
  return `${PROXY_SERVER}/proxy/${url.host}${url.pathname}${url.search}${url.hash}`;
}

function App() {
  const [currentUrl, setCurrentUrl] = useState(sites[0].url)

  return (
    <div className="app-container">
      <header className="app-bar">
        <div className="brand">📊 statshub.lol</div>
        <nav className="nav-buttons">
          {sites.map((site) => (
            <button key={site.url} onClick={() => setCurrentUrl(site.url)}>
              {site.name}
            </button>
          ))}
        </nav>
      </header>
      <iframe title="stats-site" src={getProxyUrl(currentUrl)} className="site-frame" />
    </div>
  )
}

export default App
