import React, { useEffect } from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import logo from './logo.svg';
import './App.css';
import LoginPage from './Components/LoginPage';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import ChatPage from './Components/ChatPage';

function App() {
  const { instance, accounts, inProgress } = useMsal();

  useEffect(() => {
    if (inProgress === 'none' && accounts.length === 0) {
      instance.loginRedirect().catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          // Force a redirect to the login page
          instance.loginRedirect();
        }
      });
    }
  }, [instance, accounts, inProgress]);

  return (
    <div className="mainContent">
      {accounts.length > 0 ? (
        <AuthenticatedTemplate>
          <ChatPage />
        </AuthenticatedTemplate>
      ) : (
        <UnauthenticatedTemplate>
          <LoginPage />
        </UnauthenticatedTemplate>
      )}
    </div>
  );
}

export default App;