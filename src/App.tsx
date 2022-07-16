import React from 'react';
import './App.css';
import 'react-reflex/styles.css';
import { Simulator } from './components/SimulatorLayout';
import { Page } from './components/Layout';

export const App = () => {
  return (
    <Page>
      <Simulator/>
    </Page>
  );
}
