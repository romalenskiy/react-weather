import React, { Component } from 'react';
import './WeatherCard.scss'

const WeatherCard = ({ className = '' }) => {
  const cardClasses = `weather-card cell auto ${className}`

  return (
    <div className={cardClasses}>
      <div className="day-of-the-week">Monday</div>
      <div className="date">01.12</div>
      <div className="icon snow"></div>
      <div className="temperature">-5°C</div>
    </div>
  )
}

export default WeatherCard;