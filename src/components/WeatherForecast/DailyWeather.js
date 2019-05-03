import React from 'react'
import { WeatherCardDaily } from '../WeatherCard'
import './WeatherForecast.scss'

import { GridX } from '../Foundation'

import shockedCloud from '../../assets/img/shocked-cloud-icon.svg'

import { WEEK_DAYS } from '../../constants'

function DailyWeather({ list, isLoading, errorMessage }) {
  let renderComponent

  if (errorMessage) {
    renderComponent = (
      <div className="cell auto error">
        <img className="error-icon" src={shockedCloud} alt="error" />
        <p>
          {errorMessage}
        </p>
      </div>
    )
  } else if (!list) {
    renderComponent = []
    for (let i = 0; i < 5; i += 1) {
      renderComponent.push(<WeatherCardDaily key={i} isLoading={isLoading} />)
    }
  } else {
    renderComponent = (
      list.map((item) => {
        const temp = Math.round(item.main.temp)
        const date = new Date(item.dt * 1000)
        const month = date.getUTCMonth()
        const formattedDate = `${date.getUTCDate()}.${month.toString().length === 1 ? `0${month + 1}` : (month + 1)}`
        const dayOfTheWeek = WEEK_DAYS[date.getUTCDay()]
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
    )
  }

  return (
    <GridX className="weather-dock cell auto shrink">
      {renderComponent}
    </GridX>
  )
}

export default DailyWeather
