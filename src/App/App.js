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
      locationName: '',
      isLoading: false,
      errorMessage: null,
    }

    this.getUserLocation = this.getUserLocation.bind(this)
    this.setWeatherForecast = this.setWeatherForecast.bind(this)
    this.fetchForecastByCoords = this.fetchForecastByCoords.bind(this)
    this.fetchForecastByName = this.fetchForecastByName.bind(this)
    this.onLocationSearchChange = this.onLocationSearchChange.bind(this)
    this.onLocationSearchSubmit = this.onLocationSearchSubmit.bind(this)
  }

  componentDidMount() {
    this.getUserLocation()
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ isLoading: true })
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      this.fetchForecastByCoords({ lat, lon })
    })
  }

  setWeatherForecast(result) {
    const locationName = `${result.city.name}, ${result.city.country}`
    this.setState({ weatherForecast: result, locationName, isLoading: false, errorMessage: null })
  }

  fetchForecastByCoords({ lat, lon }) {
    axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      .then(result => this.setWeatherForecast(result.data))
      .catch(() => this.setState({ errorMessage: 'Whoops, something went wrong with your geolocation. Try to manually search your city!', isLoading: false }))
  }

  fetchForecastByName(locationName) {
    axios(`https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      .then(result => this.setWeatherForecast(result.data))
      .catch(() => this.setState({ errorMessage: 'Whoops, city not found...', isLoading: false }))
  }

  onLocationSearchChange(event) {
    this.setState({ locationName: event.target.value })
  }

  onLocationSearchSubmit(event) {
    event.preventDefault()

    this.setState({ isLoading: true })
    this.fetchForecastByName(this.state.locationName)
  }

  render() {
    const { weatherForecast, locationName, isLoading, errorMessage } = this.state
    let list = null

    if (weatherForecast) {
      list = []
      let days = []
      
      // Filter to make a list in which each of the days will be included only once
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
        <LocationSearch value={locationName} onChange={this.onLocationSearchChange} onSubmit={this.onLocationSearchSubmit} /> 
        <DailyWeather list={list} isLoading={isLoading} errorMessage={errorMessage}/>
      </GridY>
   )
  }
}

export default App