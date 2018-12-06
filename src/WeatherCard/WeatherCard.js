import React, { Component } from 'react';
import './WeatherCard.scss'

const WeatherCard = ({date = '01.01', dayOfTheWeek = '', temp = 'N/A', weather = '', className = '', isLoading = false }) => {
  const cardClasses = `weather-card cell auto ${className}`
  const iconClasses = isLoading ? 'icon spin' : `icon ${weather}`

  return (
    <div className={cardClasses}>
      <div className="day-of-the-week">{dayOfTheWeek}</div>
      <div className="date">{date}</div>
      <div className={iconClasses}></div>
      <div className="temperature">{isLoading ? 'Loading' : `${temp}°C`}</div>
    </div>
  )
}

export default WeatherCard;