import React, { Component } from 'react';
import axios from 'axios'
import './App.scss';

import { GridX, GridY } from '../Foundation'
import { DailyWeather } from '../DailyWeather'
import { LocationSearch } from '../LocationSearch'

import logo from '../assets/img/React-weather-logo.png'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherForecast: null,
      isLoading: false,
    }

    this.getUserLocation = this.getUserLocation.bind(this)
    this.setWeatherForecast = this.setWeatherForecast.bind(this)
    this.fetchWeatherForecast = this.fetchWeatherForecast.bind(this)
  }

  componentDidMount() {
    this.getUserLocation()
    this.setState({ isLoading: true })
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      this.fetchWeatherForecast({ lat, lon })
    })
  }

  setWeatherForecast(result) {
    this.setState({ weatherForecast: result, isLoading: false })
  }

  fetchWeatherForecast({ lat, lon }) {
    axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      .then(result => this.setWeatherForecast(result.data))
  }

  render() {
    const { weatherForecast, isLoading } = this.state
    let locationName = ''
    let list = []
    if (weatherForecast) {
      locationName = weatherForecast.city.name

      let days = []
      list = weatherForecast.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000)
        if (days.includes(itemDate.getUTCDate())) {return false}
        days.push(itemDate.getUTCDate())
        return true
      })
    }



    return (
      <GridY className="main grid-container">
        <GridX className="cell auto shrink">
        	<img className="logo" src={logo} alt="React Weather Logo"/>
        </GridX>
        <LocationSearch value={locationName}/> 
        <DailyWeather list={list} isLoading={isLoading}/>
      </GridY>
   )
  }
}

export default App