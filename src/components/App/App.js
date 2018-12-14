import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import './App.scss';

import { GridY } from '../Foundation'
import { DailyWeather, HourlyWeather } from '../WeatherForecast'
import { LocationSearch } from '../LocationSearch'
import { Logo } from '../Logo'

import { WEEK_DAYS } from '../../constants'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weatherForecast: null,
      citySuggestions: null,
      locationName: '',
      isWeatherLoading: false,
      isCitySuggestionsLoading: false,
      errorMessage: null,
    }

    this.getUserLocation = this.getUserLocation.bind(this)
    this.setWeatherForecast = this.setWeatherForecast.bind(this)
    this.fetchForecastByCoords = this.fetchForecastByCoords.bind(this)
    this.fetchForecastByName = this.fetchForecastByName.bind(this)
    this.fetchForecastById = this.fetchForecastById.bind(this)
    this.fetchCitySuggestions = this.fetchCitySuggestions.bind(this)
    this.onLocationSearchChange = this.onLocationSearchChange.bind(this)
    this.onLocationSearchSubmit = this.onLocationSearchSubmit.bind(this)
    this.onCitySuggestionClick = this.onCitySuggestionClick.bind(this)
  }

  componentDidMount() {
    this.getUserLocation()
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ isWeatherLoading: true })
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      this.fetchForecastByCoords({ lat, lon })
    })
  }

  setWeatherForecast(result) {
    const locationName = `${result.city.name}, ${result.city.country}`
    this.setState({ weatherForecast: result, locationName, isWeatherLoading: false, errorMessage: null })
  }

  async fetchForecastByCoords({ lat, lon }) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      this.setWeatherForecast(result.data)
    } catch (error) {
      this.setState({ errorMessage: 'Whoops, something went wrong with your geolocation. Try to manually search your city!', isWeatherLoading: false })
    }
  }

  async fetchForecastByName(locationName) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      this.setWeatherForecast(result.data)
    } catch (error) {
      this.setState({ errorMessage: 'Whoops, city not found...', isWeatherLoading: false })
    }
  }

  async fetchForecastById(id) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      this.setWeatherForecast(result.data)
    } catch (error) {
      this.setState({ errorMessage: 'Whoops, city not found...', isWeatherLoading: false })
    }
  }

  async fetchCitySuggestions(locationName) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/find?q=${locationName}&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      this.setState({ citySuggestions: result, isCitySuggestionsLoading: false })
    } catch (error) {
      this.setState({ citySuggestions: null, isCitySuggestionsLoading: false })
    }
  }

  onLocationSearchChange(event) {
    const locationName = event.target.value

    this.setState({ locationName: locationName })

    if (locationName.length >= 3) {
      this.setState({ isCitySuggestionsLoading: true })
      this.fetchCitySuggestions(locationName)
    } else {
      this.setState({ citySuggestions: null })
    }
  }

  onLocationSearchSubmit(event) {
    event.preventDefault()

    this.setState({ isWeatherLoading: true, citySuggestions: null })
    this.fetchForecastByName(this.state.locationName)
  }

  onCitySuggestionClick(event) {
    const cityId = event.target.getAttribute('data-city-id')
    
    this.setState({ isWeatherLoading: true, citySuggestions: null })
    this.fetchForecastById(cityId)
  }

  render() {
    const { weatherForecast, citySuggestions, locationName, isWeatherLoading, isCitySuggestionsLoading, errorMessage } = this.state
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
        <Logo />

        <LocationSearch value={locationName} onChange={this.onLocationSearchChange} onSubmit={this.onLocationSearchSubmit} onCitySuggestionClick={this.onCitySuggestionClick} citySuggestions={citySuggestions} isLoading={isCitySuggestionsLoading}/> 

        <DailyWeather list={dayList} isLoading={isWeatherLoading} errorMessage={errorMessage}/>

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