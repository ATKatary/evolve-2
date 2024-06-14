import * as React from 'react';

import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, createTheme } from '@mui/material';

import './index.css';
import { THEME } from './constants';
import Landing from './pages/login';
import AdminPage from './pages/admin';
import CoachPage from './pages/coach';
import { useCustomState } from './utils';
import StudentPage from './pages/student';
import { AuthProvider } from './context/auth';
import { LoadingContextType, NotificationContextType, NotificationType, loadingType } from './types';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const LoadingContext = React.createContext<LoadingContextType | null>(null);
export const NotificationContext = React.createContext<NotificationContextType>(null);

function App({...props}) {
  const [loading, setLoading] = useCustomState<loadingType>({});
  const [notification, setNotification] = useCustomState<NotificationType>({});
  const theme = createTheme({
    typography: {
      fontFamily: 'Helios Extended',
      body1: {
        color: THEME.TEXT
      }
    }
  })

  return (
    <LoadingContext.Provider value={{loading: loading, setLoading: setLoading}}>
      <NotificationContext.Provider value={{notification: notification, setNotification: setNotification}}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/coach" element={<CoachPage />} />
              <Route path="/student" element={<StudentPage />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </NotificationContext.Provider>
    </LoadingContext.Provider>
  )
}

root.render(
  // <React.StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
