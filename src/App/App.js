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
    this.setState({ weatherForecast: result, locationName, isLoading: false })
  }

  fetchForecastByCoords({ lat, lon }) {
    axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      .then(result => this.setWeatherForecast(result.data))
  }

  fetchForecastByName(locationName) {
    axios(`https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      .then(result => this.setWeatherForecast(result.data))
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
    const { weatherForecast, locationName, isLoading } = this.state
    let list = []

    if (weatherForecast) {
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
        <LocationSearch value={locationName} onChange={this.onLocationSearchChange} onSubmit={this.onLocationSearchSubmit} /> 
        <DailyWeather list={list} isLoading={isLoading}/>
      </GridY>
   )
  }
}

export default App