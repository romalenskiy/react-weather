import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import './App.scss';

import { GridX, GridY } from '../Foundation'
import { DailyWeather, HourlyWeather } from '../WeatherForecast'
import { LocationSearch } from '../LocationSearch'

import { WEEK_DAYS } from '../../constants'

import logo from '../../assets/img/React-weather-logo.png'

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
    let dayList = null
    let hourList = null
    let dayOfTheWeek = null

    if (weatherForecast) {
      dayList = []
      hourList = weatherForecast.list
      let days = []
      
      // Filter to make a dayList in which each of the days will be included only once
      dayList = weatherForecast.list.filter((item) => {
        const itemDate = new Date(item.dt * 1000)
        if (days.includes(itemDate.getUTCDate())) {return false}
        days.push(itemDate.getUTCDate())
        return true
      })

      // Getting current day of the week to appropriate redirect
      const date = new Date(dayList[0].dt * 1000)
      dayOfTheWeek = WEEK_DAYS[date.getUTCDay()].toLowerCase()
    }



    return (
      <GridY className="main grid-container">
        <GridX className="cell auto shrink">
          <Link to="/">
            <img className="logo" src={logo} alt="React Weather Logo"/>
          </Link>
        </GridX>
        <LocationSearch value={locationName} onChange={this.onLocationSearchChange} onSubmit={this.onLocationSearchSubmit} /> 
        <DailyWeather list={dayList} isLoading={isLoading} errorMessage={errorMessage}/>

        <Route exact path="/" render={() =>
          dayOfTheWeek && <Redirect to={`/day/${dayOfTheWeek}`} />} 
        />

        <Route path="/day/:dayOfTheWeek" render={(props) => 
          !errorMessage && <HourlyWeather {...props}  list={hourList} />}
        />
      </GridY>
   )
  }
}

export default App