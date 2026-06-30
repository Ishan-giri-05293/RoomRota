import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

/**
 * The Root Entry Point
 * 
 * We keep this file extremely clean. Its only job is to provide
 * the Auth Context and render our calibrated routes.
 */
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;