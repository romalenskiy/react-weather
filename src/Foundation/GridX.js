import React, { Component } from 'react';

const GridX = ({className = '', children }) => {
  const classes = `grid-x ${className}`

  return (
    <div className={classes}>
      { children }
    </div>
  )
}

export default GridX;
