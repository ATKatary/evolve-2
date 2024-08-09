import * as React from 'react';

import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider, Typography, createTheme } from '@mui/material';

import './index.css';
import './assets/editor.css';

import { theme } from './theme';
import { apolloClient } from './api/clients';
import { AuthProvider } from './context/auth';
import { Confirm, Loading, Notification } from './support';
import { getDevOrDepUrl, useCustomState } from './utils';
import { loadingContextType, notificationContextType, notificationType, loadingType, confirmType, confirmContextType } from './types';

import Landing from './landing';
import Login from './pages/login';
import CoachPage from './pages/coach';
import StudentPage from './pages/student';
import { COLORS, THEME } from './constants';
import { Sign } from 'crypto';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

export const ConfirmContext = React.createContext<confirmContextType | null>(null);
export const LoadingContext = React.createContext<loadingContextType | null>(null);
export const NotificationContext = React.createContext<notificationContextType>(null);

function App({...props}) {
  // const font = new FontLoader().parse(kgBrokenVesselsSketch as any);
  const [loading, setLoading] = useCustomState<loadingType>({});
  const [confirm, setConfirm] = useCustomState<confirmType>({} as confirmType);
  const [notification, setNotification] = useCustomState<notificationType>({});


  const cancelConfirm = () => {
    if (confirm.callback) confirm.callback();

    setConfirm({
      required: false, 
      editing: undefined,
      callback: undefined,
      openDialogue: false,
    })
  }
  const confirmRequired = (callback?: CallableFunction, required?: boolean, title?: string, content?: string) => {
    if (confirm.required || required) {
      setConfirm({
        openDialogue: true, 
        callback: callback,
        title: title,
        content: content
      });
    } else if (callback) callback();
  }

  return (
    <LoadingContext.Provider value={{loading: loading, setLoading: setLoading}}>
      <NotificationContext.Provider value={{notification: notification, setNotification: setNotification}}>
        <ConfirmContext.Provider value={{confirm: confirm, setConfirm: setConfirm, confirmRequired: confirmRequired}}>
          <ThemeProvider theme={theme}>
            <BrowserRouter>
              <Routes>
                {/*** Add defualt url handle ***/}
                <Route path={getDevOrDepUrl("evolve")} element={<Landing />} />
                <Route path={getDevOrDepUrl("sign")} element={<Login />} />
                <Route path={getDevOrDepUrl("coach")} element={<CoachPage />} />
                <Route path={getDevOrDepUrl("student")} element={<StudentPage />} />
                <Route path={getDevOrDepUrl("evolveCoach")} element={<Login isCoach/>} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
          <Confirm 
            disagreeText="Cancel"
            agreeAutoFocus={false}
            handleDisagree={() => setConfirm({openDialogue: false})}
            title={confirm.title? confirm.title : "Are you sure you want to go back?"}
            content={confirm.content? <>{confirm.content}</> : <>Your changes to {confirm.editing} <b>will not be saved</b></>}
            agreeText={<Typography style={{color: THEME.ACTIVE_ACCENT, fontSize: "0.875rem"}}>Confirm</Typography>}
            handleAgree={() => cancelConfirm()}
            
            open={confirm.openDialogue || false} 
            style={{
                borderRadius: 0,
                backgroundColor: THEME.BACKGROUND_ACCENT_2
            }}
            setOpen={(value: boolean) => {}}
          />
        <Loading loading={loading} setLoading={setLoading} />
        <Notification notification={notification} setNotification={setNotification} duration={6000}/>
        </ConfirmContext.Provider>
      </NotificationContext.Provider>
    </LoadingContext.Provider>
  )
}

root.render(
  // <React.StrictMode>
  <ApolloProvider client={apolloClient}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ApolloProvider>
  // </React.StrictMode>
);

