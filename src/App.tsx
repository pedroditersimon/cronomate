import { ReactNode } from 'react'
import './App.css'
import PageLayout from './layouts/PageLayout'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TodayActivities } from './pages/TodayActivities';
import { NotFound } from './pages/NotFound';

function App() {
  console.log("app");
  function pageWith(element: () => ReactNode) {
    return <PageLayout children={element()} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={pageWith(TodayActivities)} />
        <Route path='*' element={pageWith(NotFound)} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
