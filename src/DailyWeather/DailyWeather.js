import React, { Component } from 'react'
import { WeatherCard } from '../WeatherCard'
import './DailyWeather.scss'

import { GridX } from '../Foundation'

const weekDays = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday'
}

const DailyWeather = ({ list, isLoading }) => {
  const defaultList = []

  if (list.length === 0) {
    for (let i = 0; i < 5; i++ ) {
      defaultList.push(<WeatherCard key={i} isLoading={isLoading}/>)
    }
  }

  return (
    <GridX className="weather-dock cell auto shrink">
      {list.length === 0
        ? defaultList.map((item) => item)
        : list.map((item) => {
            const temp = Math.round(item.main.temp)
            const date = new Date(item.dt * 1000)
            const formattedDate = `${date.getUTCDate()}.${date.getUTCMonth()}`
            const dayOfTheWeek = weekDays[date.getUTCDay()]
            const weather = item.weather[0].main.toLowerCase()

            return (
              <WeatherCard 
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
