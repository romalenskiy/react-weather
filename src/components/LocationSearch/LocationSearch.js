import React, { useState, useEffect, useRef } from 'react'
import { DebounceInput } from 'react-debounce-input'
import './LocationSearch.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { GridX } from '../Foundation'

function LocationSearch(props) {
  const {
    value, onChange, onSubmit, onCitySuggestionClick, citySuggestions,
    isLoading, cursorCounter, handleNavigation,
  } = props

  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false)

  const searchInput = useRef()

  function handleSearchBlur() {
    setIsSuggestionsVisible(false)
  }

  function handleSearchFocus() {
    setIsSuggestionsVisible(true)
  }

  useEffect(() => {
    if (searchInput.current) { searchInput.current.focus() }
  }, []) // without second argument focus become permanent https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects

  function onClick(event) {
    event.target.select()
  }

  // Rendering
  let searchSuggestionsClasses = 'search-suggestions menu vertical small-12 medium-6 large-4'
  if (!isSuggestionsVisible) searchSuggestionsClasses += ' hide'

  let suggestionList

  if (isLoading) {
    suggestionList = (
      <li className="suggestion loading">
        <FontAwesomeIcon className="loading-icon" icon="sync-alt" spin />
        Loading
      </li>
    )
  } else if (citySuggestions && citySuggestions.list.length === 0) {
    suggestionList = (
      <li className="suggestion not-found">
        No suggestion found.
      </li>
    )
  } else if (citySuggestions) {
    suggestionList = (
      citySuggestions.list.map((item, index) => {
        const coorMix = `${item.coord.lat}${item.coord.lon}`
        const { name, id } = item
        const { country } = item.sys
        let suggestionClasses = 'suggestion item'
        suggestionClasses = cursorCounter === index ? suggestionClasses += ' active' : suggestionClasses

        return <li key={coorMix} className={suggestionClasses} onMouseDown={onCitySuggestionClick} data-city-id={id}>{`${name}, ${country}`}</li>
      })
    )
  }

  return (
    <GridX className="location-search cell auto shrink">
      <form onSubmit={onSubmit} className="search-form cell small-12 medium-6 large-4">
        <DebounceInput value={value} debounceTimeout="1000" onChange={onChange} onClick={onClick} onKeyDown={handleNavigation} onBlur={handleSearchBlur} onFocus={handleSearchFocus} className="search-input" type="text" inputRef={searchInput} />
        <button className="search-submit" type="submit">
          <FontAwesomeIcon icon="search" />
        </button>
      </form>
      <ul className={searchSuggestionsClasses}>
        {suggestionList}
      </ul>
    </GridX>
  )
}

export default LocationSearch
