import React, { Component } from 'react'
import { WeatherCardDaily } from '../WeatherCard'
import './WeatherForecast.scss'

import { GridX } from '../Foundation'

import shockedCloud from '../assets/img/shocked-cloud-icon.svg'

const weekDays = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

const DailyWeather = ({ list, isLoading, errorMessage }) => {
  const defaultList = []

  if (!list) {
    for (let i = 0; i < 5; i++ ) {
      defaultList.push(<WeatherCardDaily key={i} isLoading={isLoading}/>)
    }
  }

  return (
    <GridX className="weather-dock cell auto shrink">
      {errorMessage
        ? <div className="cell auto error">
            <img className="error-icon" src={shockedCloud} alt="error"/>
            <p>
              {errorMessage}
            </p>
          </div>
        : !list
          ? defaultList.map((item) => item)
          : list.map((item) => {
              const temp = Math.round(item.main.temp)
              const date = new Date(item.dt * 1000)
              const formattedDate = `${date.getUTCDate()}.${date.getUTCMonth()}`
              const dayOfTheWeek = weekDays[date.getUTCDay()]
              const weather = item.weather[0].main.toLowerCase()

              return (
                <WeatherCardDaily 
                  key={item.dt} 
                  date={formattedDate} 
                  dayOfTheWeek={dayOfTheWeek} 
                  temp={temp} 
                  weather={weather} 
                  isLoading={isLoading} 
                />
              )
            })
      }
    </GridX>
  )
}

export default DailyWeather;
