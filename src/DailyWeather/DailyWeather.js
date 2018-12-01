import React, { Component } from 'react'
import { WeatherCard } from '../WeatherCard'
import './DailyWeather.scss'

import { GridX } from '../Foundation'

const DailyWeather = () => {
  return (
    <GridX className="weather-dock cell auto shrink">
        <WeatherCard className="active"/>
        <WeatherCard />
        <WeatherCard />
        <WeatherCard />
        <WeatherCard />
        <WeatherCard />
        <WeatherCard />
    </GridX>
  )
}

export default DailyWeather;
