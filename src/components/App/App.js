import React, { useState, useEffect, useReducer } from 'react'
import { Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import './App.scss'

import { GridY } from '../Foundation'
import { DailyWeather, HourlyWeather } from '../WeatherForecast'
import { LocationSearch } from '../LocationSearch'
import { Logo } from '../Logo'

import { WEEK_DAYS } from '../../constants'

function dataFetchReducer(state, action) {
  const { type, payload } = action

  switch (type) {
    case 'FETCH_WEATHER_INIT':
      return {
        ...state,
        isWeatherLoading: true,
        citySuggestions: null,
      }
    case 'FETCH_CITY_SUGGESTIONS_INIT':
      return {
        ...state,
        isCitySuggestionsLoading: true,
      }
    case 'FETCH_WEATHER_SUCCESS':
      return {
        ...state,
        locationName: `${payload.city.name}, ${payload.city.country}`,
        weatherForecast: payload,
        isWeatherLoading: false,
        errorMessage: null,
      }
    case 'FETCH_CITY_SUGGESTIONS_SUCCESS':
      return {
        ...state,
        citySuggestions: payload,
        isCitySuggestionsLoading: false,
      }
    case 'FETCH_CITY_SUGGESTIONS_FAILURE':
      return {
        ...state,
        citySuggestions: null,
        isCitySuggestionsLoading: false,
      }
    case 'FETCH_WEATHER_FAILURE':
      return {
        ...state,
        errorMessage: payload,
        isWeatherLoading: false,
      }
    case 'UPDATE_LOCATION_NAME': {
      return {
        ...state,
        locationName: payload,
        locationSearchCursorCounter: 0,
      }
    }
    default:
      throw new Error(`Undefined reducer action type: ${type}`)
  }
}

function useOpenWeatherMapAPI() {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    locationName: '',
    weatherForecast: null,
    isWeatherLoading: false,
    errorMessage: null,
    citySuggestions: null,
    isCitySuggestionsLoading: false,
  })
  const { citySuggestions } = state

  const [locationSearchCursorCounter, setLocationSearchCursorCounter] = useState(0)

  async function fetchForecastById(id) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?id=${id}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: result.data })
    } catch (error) {
      dispatch({ type: 'FETCH_WEATHER_FAILURE', payload: 'Whoops, city not found...' })
    }
  }

  async function fetchCitySuggestions(newLocationName) {
    try {
      const result = await axios(`https://api.openweathermap.org/data/2.5/find?q=${newLocationName}&APPID=${process.env.REACT_APP_OW_API_KEY}`)
      dispatch({ type: 'FETCH_CITY_SUGGESTIONS_SUCCESS', payload: result.data })
    } catch (error) {
      dispatch({ type: 'FETCH_CITY_SUGGESTIONS_FAILURE' })
    }
  }

  function onLocationSearchChange(event) {
    const newLocationName = event.target.value

    dispatch({ type: 'UPDATE_LOCATION_NAME', payload: newLocationName })

    if (newLocationName.length >= 3) {
      dispatch({ type: 'FETCH_CITY_SUGGESTIONS_INIT' })
      fetchCitySuggestions(newLocationName)
    } else {
      dispatch({ type: 'FETCH_CITY_SUGGESTIONS_FAILURE' })
    }
  }

  function onLocationSearchSubmit(event) {
    event.preventDefault()

    const activeCitySuggestion = document.querySelector('.suggestion.item.active')
    if (!activeCitySuggestion) return
    const cityId = activeCitySuggestion.getAttribute('data-city-id')

    dispatch({ type: 'FETCH_WEATHER_INIT' })
    setLocationSearchCursorCounter(0)

    fetchForecastById(cityId)
  }

  function onCitySuggestionClick(event) {
    const cityId = event.target.getAttribute('data-city-id')

    dispatch({ type: 'FETCH_WEATHER_INIT' })
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
    } else if (event.key === 'ArrowDown' && locationSearchCursorCounter < citySuggestions.list.length - 1) {
      setLocationSearchCursorCounter(locationSearchCursorCounter + 1)
    }
  }

  useEffect(() => {
    async function fetchForecastByCoords({ latitude, longitude }) {
      try {
        const result = await axios(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&APPID=${process.env.REACT_APP_OW_API_KEY}`)
        dispatch({ type: 'FETCH_WEATHER_SUCCESS', payload: result.data })
      } catch (error) {
        dispatch({ type: 'FETCH_WEATHER_FAILURE', payload: 'Whoops, something went wrong with your geolocation. Try to manually search your city!' })
      }
    }

    function getUserLocation() {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords

        dispatch({ type: 'FETCH_WEATHER_INIT' })
        fetchForecastByCoords({ latitude, longitude })
      })
    }

    getUserLocation()
  }, [])

  return {
    ...state,
    onLocationSearchChange,
    onLocationSearchSubmit,
    onCitySuggestionClick,
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
