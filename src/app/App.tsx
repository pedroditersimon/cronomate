import 'src/app/styles/App.css';
import 'src/app/styles/scrollbar.css';
import StyledToaster from 'src/shared/components/StyledToaster';
import ConfirmationDialog from 'src/shared/components/ConfirmationDialog';
import ReduxProvider from './states/redux/ReduxProvider'
import { AppRouter } from 'src/app/routing/Router';
import TodaySessionTimerConsumer from 'src/features/today-session/components/TodaySessionTimerConsumer';
import ChecklistTimerConsumer from 'src/features/notes/components/ChecklistTimerConsumer';
import PomodoroTimerConsumer from 'src/features/pomodoro/components/PomodoroTimerConsumer';


export default function App() {
  return (
    <ReduxProvider>

      <StyledToaster />
      <TodaySessionTimerConsumer />
      <ChecklistTimerConsumer />
      <PomodoroTimerConsumer />
      <AppRouter />
      <ConfirmationDialog />

    </ReduxProvider >
  )
};
