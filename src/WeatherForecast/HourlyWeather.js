import React, { Component } from 'react'
import { WeatherCardHourly } from '../WeatherCard'
import './WeatherForecast.scss'

import { GridX } from '../Foundation'

const dayIDs = {
  'sunday': 0,
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6
}

const HourlyWeather = ({ match, list, error }) => {
  const dayID = dayIDs[match.params.dayOfTheWeek]
  let filteredList = []  

  if (list) {  
      filteredList = list.filter((item) => {
      const itemDate = new Date(item.dt * 1000)
      return itemDate.getDay() === dayID
    })
  }

  return (
    <GridX className="weather-dock hourly cell auto">
      {
        filteredList.map((item) => {
          const temp = Math.round(item.main.temp)
          const date = new Date(item.dt * 1000)
          const formattedDate = date.toTimeString().slice(0, 5)
          const weather = item.weather[0].main.toLowerCase()

          return (
            <WeatherCardHourly 
              key={item.dt} 
              date={formattedDate} 
              temp={temp} 
              weather={weather} 
            />
          )
        })
      }
    </GridX>
  )
}

export default HourlyWeather;
