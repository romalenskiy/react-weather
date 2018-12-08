import React, { Component } from 'react';
import './LocationSearch.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { GridX } from '../Foundation'

const LocationSearch = ({ value, onChange, onSubmit }) => {
  return (
    <GridX className="location-search cell auto shrink">
      <form onSubmit={onSubmit} className="search-form cell small-auto medium-6 large-4">
        <input value={value} onChange={onChange} className="search-input" type="text" />
        <button className="search-submit" type="submit">
          <FontAwesomeIcon icon="map-marker-alt" />
        </button>
      </form>
    </GridX>
  )
}

export default LocationSearch;