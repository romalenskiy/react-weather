import React from 'react'
import './WeatherCard.scss'

function WeatherCard({
  date, temp, weather, className = '',
}) {
  const cardClasses = `weather-card hourly cell auto ${className}`
  const iconClasses = `icon ${weather}`

  return (
    <div className={cardClasses}>
      <div className="date">{date}</div>
      <div className={iconClasses} />
      <div className="temperature">{`${temp}°C`}</div>
    </div>
  )
}

export default WeatherCard
