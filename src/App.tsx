import './App.css'
import Activity from './components/Activity/Activity';
import Container from './layouts/Container';
import useTodayActivities from './hooks/useTodayActivities';

function App() {
  const { activities, setActivity } = useTodayActivities();

  return (
    <div className='w-full h-full flex flex-row justify-center items-center'>
      <Container>
        {activities.map(activity => (
          <Activity key={activity.id}
            activity={activity}
            onActivityChange={newActivity => setActivity(activity.id, newActivity)}
          />
        ))}

      </Container>
    </div>
  )
}

export default App
