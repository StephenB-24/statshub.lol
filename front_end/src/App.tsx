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

function App() {
  return (
    <div className="button-grid">
      {sites.map((site) => (
        <a
          key={site.url}
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="site-button"
        >
          {site.name}
        </a>
      ))}
    </div>
  )
}

export default App
