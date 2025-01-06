import './App.css'
import Activity from './components/Activity/Activity';
import Container from './layouts/Container';
import useTodayActivities from './hooks/useTodayActivities';
import ActivityCreator from './components/Activity/ActivityCreator';

function App() {
  const { activities, setActivity, addNewActivity } = useTodayActivities();

  return (
    <div className='w-full h-full flex flex-row justify-center items-center'>

      <Container>
        {activities.map(activity => (
          <Activity key={activity.id}
            activity={activity}
            onActivityChange={newActivity => setActivity(activity.id, newActivity)}
          />
        ))}
        <ActivityCreator onActivityCreated={addNewActivity} />
      </Container>

    </div>
  )
}

export default App
