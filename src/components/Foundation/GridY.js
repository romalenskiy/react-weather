import React from 'react'

function GridY({ className = '', children }) {
  const classes = `grid-y ${className}`

  return (
    <div className={classes}>
      { children }
    </div>
  )
}

export default GridY
