import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input'
import './LocationSearch.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { GridX } from '../Foundation'

class LocationSearch extends Component {
  constructor(props) {
    super(props)
    this.searchInput = React.createRef()
    this.citySuggestion = React.createRef()

    this.state = {
      isSuggestionsVisible: false,
    }

    this.onClick = this.onClick.bind(this)
    this.handleSearchBlur = this.handleSearchBlur.bind(this)
    this.handleSearchFocus = this.handleSearchFocus.bind(this)
  }   

  componentDidMount() {
    if (this.searchInput.current) this.searchInput.current.focus()
  }

  onClick(event) {
    event.target.select()
  }

  handleSearchBlur() {
    this.setState({ isSuggestionsVisible: false })
  }

  handleSearchFocus() {
    this.setState({ isSuggestionsVisible: true })
  }

  render() {
    const { value, onChange, onSubmit, onCitySuggestionClick, citySuggestions, isLoading, cursorCounter, handleNavigation } = this.props
    const { isSuggestionsVisible } = this.state

    let searchSuggestionsClasses = 'search-suggestions menu vertical small-12 medium-6 large-4'
    if (!isSuggestionsVisible) searchSuggestionsClasses += ' hide'

    return (
      <GridX className="location-search cell auto shrink">
        <form onSubmit={onSubmit} className="search-form cell small-12 medium-6 large-4">
          <DebounceInput value={value} debounceTimeout="1000" onChange={onChange} onClick={this.onClick} onKeyDown={handleNavigation} onBlur={this.handleSearchBlur} onFocus={this.handleSearchFocus} className="search-input" type="text" inputRef={this.searchInput} />
          <button className="search-submit" type="submit">
            <FontAwesomeIcon icon="search" />
          </button>
        </form>
        <ul className={searchSuggestionsClasses}>
          {isLoading 
          ? <li className="suggestion loading"><FontAwesomeIcon className="loading-icon" icon="sync-alt" spin/>Loading</li>
          : citySuggestions && citySuggestions.data.list.length === 0
            ? <li className="suggestion not-found">No suggestion found.</li>
            : citySuggestions && citySuggestions.data.list.map((item, index) => {
                const coorMix = `${item.coord.lat}${item.coord.lon}`
                const name = item.name
                const id = item.id
                const country = item.sys.country
                let suggestionClasses = 'suggestion item'
                suggestionClasses = cursorCounter === index ? suggestionClasses += ' active' : suggestionClasses

                return <li key={coorMix} className={suggestionClasses} onMouseDown={onCitySuggestionClick} ref={this.citySuggestion} data-city-id={id}>{`${name}, ${country}`}</li>
              })
          }
        </ul>
      </GridX>
    )
  }

}

export default LocationSearch;