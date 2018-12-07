import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './WeatherCard.scss'

const WeatherCard = ({date = '01.01', dayOfTheWeek = '', temp = 'N/A', weather = '', className = '', isLoading = false }) => {
  const cardClasses = `weather-card daily cell auto ${className}`
  const iconClasses = isLoading ? 'icon spin' : `icon ${weather}`

  return (
    <NavLink className={cardClasses} to={`/day/${dayOfTheWeek.toLowerCase()}`} activeClassName="active">
      <div className="day-of-the-week">{dayOfTheWeek}</div>
      <div className="date">{date}</div>
      <div className={iconClasses}></div>
      <div className="temperature">{isLoading ? 'Loading' : `${temp}°C`}</div>
    </NavLink>
  )
}

export default WeatherCard