import { ReactNode } from 'react'
import './App.css'
import PageLayout from './layouts/PageLayout'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TodaySession } from './pages/TodaySession';
import { NotFound } from './pages/NotFound';
import { History } from './pages/History';

function App() {
  console.log("app");
  function pageWith(element: () => ReactNode) {
    return <PageLayout children={element()} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={pageWith(TodaySession)} />
        <Route path='/history' element={pageWith(History)} />
        <Route path='*' element={pageWith(NotFound)} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
