import { useState } from 'react'
import './App.css'

type Site = {
  name: string
  url: string
}

const sites: Site[] = [
  { name: 'u.gg', url: 'https://u.gg' },
  { name: 'deeplol.gg', url: 'https://deeplol.gg' },
  { name: 'op.gg', url: 'https://www.op.gg' },
]

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
      <iframe title="stats-site" src={currentUrl} className="site-frame" />
    </div>
  )
}

export default App
