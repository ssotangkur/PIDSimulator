import React from 'react';
import './App.css';
import { Simulator } from './components/Simulator';
import { Page } from './components/Layout';

export const App = () => {
  return (
    <Page>
      <Simulator/>
    </Page>
  );
}
