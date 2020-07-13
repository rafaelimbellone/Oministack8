import React from 'react';
import Login from './src/pages/Login'
import Routes from './src/routes';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket',
  'Possible Unhandled'
]);
export default function App() {
  return (
    <Routes />
  );
}

