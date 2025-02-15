import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

import ReduxStoreProvider from './redux/ReduxStoreProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxStoreProvider>
      <App />
    </ReduxStoreProvider>
  </StrictMode>,
)
