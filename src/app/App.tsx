import 'src/app/styles/App.css';
import 'src/app/styles/scrollbar.css';
import StyledToaster from 'src/shared/components/StyledToaster';
import ConfirmationDialog from 'src/shared/components/ConfirmationDialog';
import ReduxProvider from './states/redux/ReduxProvider'
import { AppRouter } from 'src/app/routing/Router';


export default function App() {
  return (
    <ReduxProvider>

      <StyledToaster />
      <AppRouter />
      <ConfirmationDialog />

    </ReduxProvider >
  )
};
