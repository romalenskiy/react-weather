import React, { Component } from 'react';
import './App.scss';

import { GridX, GridY } from '../Foundation'
import { DailyWeather } from '../DailyWeather'
import { LocationSearch } from '../LocationSearch'

import logo from '../assets/img/React-weather-logo.png'

class App extends Component {
  render() {
    return (
      <GridY className="main grid-container">
        <GridX className="cell auto shrink">
        	<img className="logo" src={logo} alt="React Weather Logo"/>
        </GridX>
        <LocationSearch /> 
        <DailyWeather />
      </GridY>
   )
  }
}

export default App;
