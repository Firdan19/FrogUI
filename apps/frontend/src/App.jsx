import { useState, useEffect } from 'react'
import '@frogui/ui-core'
import './App.css'

function App() {
  const [jwtToken, setJwtToken] = useState('')

  useEffect(() => {
    // Simulasi pengambilan JWT token dari login di frontend React
    setJwtToken('simulated-jwt-token-1234')
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '40px', background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#f2eee5' }}>FrogUI React Dashboard</h1>
        <frog-command-panel gateway-url="http://localhost:3001" jwt-token={jwtToken}></frog-command-panel>
      </section>

      <section>
        <frog-agent-stream gateway-url="http://localhost:3001"></frog-agent-stream>
      </section>
    </div>
  )
}

export default App
