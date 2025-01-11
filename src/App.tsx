import './App.css'
import { BriefcaseIcon } from './assets/Icons'
import Sidebar from './layouts/Sidebar'
import TodayActivities from './sections/TodayActivities'

function App() {
  return (
    <div className='w-screen h-screen flex flex-row justify-around items-center'>

      <div className='p-5 h-full'>
        <Sidebar
          links={[
            {
              href: "/",
              icon: <BriefcaseIcon />,
              text: "Hoy",
            },
            {
              href: "/1",
              text: "Sin icono",
            },
            {
              href: "/2",
              icon: <BriefcaseIcon />,
            }
          ]}
        />
      </div>

      <div className='p-5 m-auto'>
        <TodayActivities />
      </div>

    </div>
  )
}

export default App
