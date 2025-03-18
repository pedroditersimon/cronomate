import './App.css';
import "./scrollbar.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TodaySessionPage from '../pages/TodaySessionPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { HistoryPage } from '../pages/HistoryPage';
import StyledToaster from 'src/shared/components/StyledToaster';
import ReduxStoreProvider from './states/redux/ReduxStoreProvider'

function App() {
  return (
    <ReduxStoreProvider>

      <StyledToaster />

      <BrowserRouter>
        // TODO: routing.md
        <Routes>
          <Route path='/' element={<TodaySessionPage />} />

          <Route path='/history' element={<HistoryPage />} />
          <Route path='/history/:id' element={<HistoryPage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

    </ReduxStoreProvider >
  )
}

export default App
