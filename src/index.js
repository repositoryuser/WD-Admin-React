import React from "react";
// import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import translations from '@shopify/polaris/locales/en.json';
import App from "./App";
// import * as serviceWorker from "./serviceWorker";
import { AppProvider } from '@shopify/polaris';
import '@shopify/polaris/build/esm/styles.css';
import { AuthProvider } from "./ContextApi/AuthContext";


// create a root
const root = createRoot(document.getElementById('root'));


root.render(
  <BrowserRouter>
    <AppProvider i18n={{
      Polaris: {
        Avatar: {
          label: 'Avatar',
          labelWithInitials: 'Avatar with initials {initials}',
        },
        ContextualSaveBar: {
          save: 'Save',
          discard: 'Discard',
        },
        TextField: {
          characterCount: '{count} characters',
        },
        TopBar: {
          toggleMenuLabel: 'Toggle menu',

          SearchField: {
            clearButtonLabel: 'Clear',
            search: 'Search',
          },
        },
        Modal: {
          iFrameTitle: 'body markup',
        },
        Frame: {
          skipToContent: 'Skip to content',
          navigationLabel: 'Navigation',
          Navigation: {
            closeMobileNavigationLabel: 'Close navigation',
          },
        },
      }, translations
    }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProvider>
  </BrowserRouter>);


