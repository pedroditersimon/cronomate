import 'src/app/styles/App.css';
import 'src/app/styles/scrollbar.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TodaySessionPage from '../features/today-session/pages/TodaySessionPage';
import { NotFoundPage } from '../shared/pages/NotFoundPage';
import { SessionsHistoryPage } from '../features/sessions-history/pages/SessionsHistoryPage';
import StyledToaster from 'src/shared/components/StyledToaster';
import ReduxStoreProvider from './states/redux/ReduxStoreProvider'
import { SessionHistoryDetailPage } from 'src/features/sessions-history/pages/SessionHistoryDetailPage';
// TODO: routing.md
function App() {
  return (
    <ReduxStoreProvider>

      <StyledToaster />

      <BrowserRouter>

        <Routes>
          <Route path='/' element={<TodaySessionPage />} />

          <Route path='/history' element={<SessionsHistoryPage />} />
          <Route path='/history/:id' element={<SessionHistoryDetailPage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

    </ReduxStoreProvider >
  )
}

export default App
