import React from 'react'

function GridX({ className = '', children }) {
  const classes = `grid-x ${className}`

  return (
    <div className={classes}>
      { children }
    </div>
  )
}

export default GridX
