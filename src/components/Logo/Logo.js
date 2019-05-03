import React from 'react'
import { Link } from 'react-router-dom'
import './Logo.scss'

import { GridX } from '../Foundation'

import logo from '../../assets/img/React-weather-logo.png'

function Logo() {
  return (
    <GridX className="cell auto shrink">
      <Link to="/">
        <img className="logo" src={logo} alt="React Weather Logo" />
      </Link>
    </GridX>
  )
}

export default Logo
