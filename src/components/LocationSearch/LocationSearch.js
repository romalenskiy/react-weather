import React, { Component } from 'react';
import './LocationSearch.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { GridX } from '../Foundation'

class LocationSearch extends Component {
  constructor(props) {
    super(props)
    this.searchInput = React.createRef()

    this.onClick = this.onClick.bind(this)
  }   

  componentDidMount() {
    if (this.searchInput.current) this.searchInput.current.focus()
  }

  onClick(event) {
    event.target.select()
  }

  render() {
    const { value, onChange, onSubmit } = this.props

    return (
      <GridX className="location-search cell auto shrink">
        <form onSubmit={onSubmit} className="search-form cell small-auto medium-6 large-4">
          <input value={value} onChange={onChange} onClick={this.onClick} className="search-input" type="text" ref={this.searchInput}/>
          <button className="search-submit" type="submit">
            <FontAwesomeIcon icon="search" />
          </button>
        </form>
      </GridX>
    )
  }

}

export default LocationSearch;