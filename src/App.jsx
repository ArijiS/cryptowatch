import React from 'react';

import { Routes, Route } from 'react-router-dom'; 

import Page from './components/Page';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Coin from "./components/Coin";


const App = () => {
  return (
    <Page >

      <Navigation />
      <Routes >
        <Route index element={<Home />} />
        <Route path="/coin/:coinId" element={<Coin />}/>
      </Routes>

    </Page>
  )
}

export default App;