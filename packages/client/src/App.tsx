import React from 'react'
import './App.css'
import { AppRoutes } from './AppRoutes'
import { RootProviders } from './RootProviders'

function App() {
  return (
    <RootProviders>
      <AppRoutes />
    </RootProviders>
  )
}

export default App
