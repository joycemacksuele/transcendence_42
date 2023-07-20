import { useState } from 'react'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
import budaLogo from '../components/images/buda01.png'
import duckLogo from '../components/images/duck.png'
import './example_vite_orig.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a> */}
        <a href="https://react.dev" target="_blank">
          <img src={budaLogo} className="logo react" alt="Buda logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={duckLogo} className="logo react" alt="Duck logo" />
        </a>
      </div>
      <h2>TRANSCENDENCE</h2>
      ( Vite/React + Nest + Postgres )
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Try click: {count}
        </button>
        {/* <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p> */}
      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
