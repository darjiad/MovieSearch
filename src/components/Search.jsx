import React from 'react'

function Search(props) {
  return (
    <div className='search'>
    <div>
        <img src= {'./search.svg'} alt= "Search"/>
        <input type="text"
            placeholder='Search through thousands of movies'
            value={props.searchTerm}
            onChange = {(e)=>props.setSearchTerm(e.target.value)}
        />
        </div>
    </div>
  )
}

export default Search