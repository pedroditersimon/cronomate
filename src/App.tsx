import './App.css';
import "./scrollbar.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TodaySessionPage } from './pages/TodaySession';
import { NotFoundPage } from './pages/NotFound';
import { HistoryPage } from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TodaySessionPage />} />

        <Route path='/history' element={<HistoryPage />} />
        <Route path='/history/:id' element={<HistoryPage />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
