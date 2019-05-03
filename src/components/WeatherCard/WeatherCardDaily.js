import React from 'react'
import MediaQuery from 'react-responsive'
import { NavLink } from 'react-router-dom'
import './WeatherCard.scss'

function WeatherCard({
  date = '01.01', dayOfTheWeek = '', temp = 'N/A', weather = '', className = '', isLoading = false,
}) {
  const cardClasses = `weather-card daily cell auto ${className}`
  const iconClasses = isLoading ? 'icon spin' : `icon ${weather}`

  return (
    <NavLink className={cardClasses} to={`/day/${dayOfTheWeek.toLowerCase()}`} activeClassName="active">
      <MediaQuery query="screen and (max-device-width: 63.9375em)">
        {
          (matches) => {
            if (matches) {
              return (
                <div className="day-of-the-week">{dayOfTheWeek.slice(0, 3)}</div>
              )
            }
            return (
              <div className="day-of-the-week">{dayOfTheWeek}</div>
            )
          }
        }
      </MediaQuery>
      <div className="date">{date}</div>
      <div className={iconClasses} />
      <div className="temperature">{isLoading ? 'Loading' : `${temp}°C`}</div>
    </NavLink>
  )
}

export default WeatherCard
