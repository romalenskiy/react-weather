import React, { Component } from 'react';
import './WeatherCard.scss'

const WeatherCard = ({date, dayOfTheWeek, temp, weather, className = '' }) => {
  const cardClasses = `weather-card cell auto ${className}`

  return (
    <div className={cardClasses}>
      <div className="day-of-the-week">{dayOfTheWeek}</div>
      <div className="date">{date}</div>
      <div className={`icon ${weather}`}></div>
      <div className="temperature">{temp}°C</div>
    </div>
  )
}

export default WeatherCard;