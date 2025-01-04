import './App.css'
import Activity from './components/Activity/Activity';
import ActivityPlaceholder from './components/Activity/ActivityPlaceholder';
import Container from './layouts/Container';
import { ActivityType } from './types/Activity';

const activities: Array<ActivityType> = [
  {
    name: "Reunión",
    entries: [
      {
        start: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), // Hace 2 horas
        end: new Date() // Hora actual
      }
    ]
  },
  {
    name: "Actividad",
    entries: [
      {
        start: new Date(new Date().getTime() - 3 * 60 * 60 * 1000), // Hace 3 horas
        end: new Date(new Date().getTime() - 1 * 60 * 60 * 1000)
      },
      {
        start: new Date(new Date().getTime() - 1 * 60 * 60 * 1000), // Hace 3 horas
        end: new Date()
      }
    ]
  }
];

function App() {
  return (
    <div className='w-full h-full flex flex-row justify-center items-center'>
      <Container>
        {activities.map(activity => (
          <Activity name={activity.name} entries={activity.entries} />
        ))}
        <ActivityPlaceholder />
      </Container>
    </div>
  )
}

export default App
