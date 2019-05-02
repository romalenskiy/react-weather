import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import './App.scss'

import { GridY } from '../Foundation'
import { DailyWeather, HourlyWeather } from '../WeatherForecast'
import { LocationSearch } from '../LocationSearch'
import { Logo } from '../Logo'

import { WEEK_DAYS } from '../../constants'

const useOpenWeatherMapAPI = () => {
  const [weatherForecast, setWeatherForecast] = useState(null)
  const [citySuggestions, setCitySuggestions] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)
  const [isCitySuggestionsLoading, setIsCitySuggestionsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [locationSearchCursorCounter, setLocationSearchCursorCounter] = useState(0)

  function handleWeatherForecastUpdate(result) {
    setWeatherForecast(result)
    setLocationName(`${result.city.name}, ${result.city.country}`)
    setIsWeatherLoading(false)
    setErrorMessage(null)
  }

  async function fetchForecastByCoords({ lat, lon }) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      handleWeatherForecastUpdate(result.data)
    } catch (error) {
      setErrorMessage('Whoops, something went wrong with your geolocation. Try to manually search your city!')
      setIsWeatherLoading(false)
    }
  }

  async function fetchForecastById(id) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      handleWeatherForecastUpdate(result.data)
    } catch (error) {
      setErrorMessage('Whoops, city not found...')
      setIsWeatherLoading(false)
    }
  }

  async function fetchCitySuggestions(newLocationName) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/find?q=${newLocationName}&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      setCitySuggestions(result)
      setIsCitySuggestionsLoading(false)
    } catch (error) {
      setCitySuggestions(null)
      setIsCitySuggestionsLoading(false)
    }
  }

  function onLocationSearchChange(event) {
    const newLocationName = event.target.value

    setLocationName(newLocationName)
    setLocationSearchCursorCounter(0)

    if (newLocationName.length >= 3) {
      setIsCitySuggestionsLoading(true)
      fetchCitySuggestions(newLocationName)
    } else {
      setCitySuggestions(null)
    }
  }

  function onLocationSearchSubmit(event) {
    event.preventDefault()

    const activeCitySuggestion = document.querySelector('.suggestion.item.active')
    if (!activeCitySuggestion) return
    const cityId = activeCitySuggestion.getAttribute('data-city-id')

    setIsWeatherLoading(true)
    setCitySuggestions(null)
    setLocationSearchCursorCounter(0)

    fetchForecastById(cityId)
  }

  function onCitySuggestionClick(event) {
    const cityId = event.target.getAttribute('data-city-id')

    setIsWeatherLoading(true)
    setCitySuggestions(null)
    setLocationSearchCursorCounter(0)

    fetchForecastById(cityId)
  }

  function handleLocationSearchNavigation(event) {
    if (!citySuggestions) return

    // Preventing cursor from jumping to end and to start of input field
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault()

    // arrow up/down button should select next/previous list element
    if (event.key === 'ArrowUp' && locationSearchCursorCounter > 0) {
      setLocationSearchCursorCounter(locationSearchCursorCounter - 1)
    } else if (event.key === 'ArrowDown' && locationSearchCursorCounter < citySuggestions.data.list.length - 1) {
      setLocationSearchCursorCounter(locationSearchCursorCounter + 1)
    }
  }

  useEffect(() => {
    function getUserLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        setIsWeatherLoading(true)
        const lat = position.coords.latitude
        const lon = position.coords.longitude
        fetchForecastByCoords({ lat, lon })
      })
    }

    getUserLocation()
  }, [])

  return {
    weatherForecast,
    isWeatherLoading,
    errorMessage,
    locationName,
    onLocationSearchChange,
    onLocationSearchSubmit,
    onCitySuggestionClick,
    citySuggestions,
    isCitySuggestionsLoading,
    locationSearchCursorCounter,
    handleLocationSearchNavigation,
  }
}

function App() {
  const {
    weatherForecast,
    isWeatherLoading,
    errorMessage,
    locationName,
    onLocationSearchChange,
    onLocationSearchSubmit,
    onCitySuggestionClick,
    citySuggestions,
    isCitySuggestionsLoading,
    locationSearchCursorCounter,
    handleLocationSearchNavigation,
  } = useOpenWeatherMapAPI()

  let dayList = null
  let hourList = null
  let dayOfTheWeek = null

  if (weatherForecast) {
    dayList = []
    hourList = weatherForecast.list
    const days = []

    // Filter to make a dayList in which each of the days will be included only once
    dayList = weatherForecast.list.filter((item) => {
      const itemDate = new Date(item.dt * 1000)
      if (days.includes(itemDate.getUTCDate())) return false
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

      <LocationSearch
        value={locationName}
        onChange={onLocationSearchChange}
        onSubmit={onLocationSearchSubmit}
        onCitySuggestionClick={onCitySuggestionClick}
        citySuggestions={citySuggestions}
        isLoading={isCitySuggestionsLoading}
        cursorCounter={locationSearchCursorCounter}
        handleNavigation={handleLocationSearchNavigation}
      />

      <DailyWeather
        list={dayList}
        isLoading={isWeatherLoading}
        errorMessage={errorMessage}
      />

      <Route
        exact
        path="/"
        render={() => dayOfTheWeek && <Redirect to={`/day/${dayOfTheWeek}`} />}
      />

      <Route
        path="/day/:dayOfTheWeek"
        render={props => !errorMessage && <HourlyWeather {...props} list={hourList} />}
      />
    </GridY>
  )
}

export default App
