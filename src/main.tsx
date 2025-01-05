import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import ReduxStoreProvider from './components/ReduxStoreProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxStoreProvider>
      <App />
    </ReduxStoreProvider>
  </StrictMode>,
)
