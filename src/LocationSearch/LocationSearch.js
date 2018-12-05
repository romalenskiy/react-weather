import React, { Component } from 'react';
import './LocationSearch.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { GridX } from '../Foundation'

const LocationSearch = ({ value }) => {
  return (
    <GridX className="location-search cell auto shrink">
      <form className="search-form cell small-auto medium-6 large-4">
        <input value={value} className="search-input" type="text" readOnly/>
        <button className="search-submit" type="submit">
          <FontAwesomeIcon icon="map-marker-alt" />
        </button>
      </form>
    </GridX>
  )
}

export default LocationSearch;