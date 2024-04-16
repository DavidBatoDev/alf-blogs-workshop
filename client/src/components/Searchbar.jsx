import React from 'react'
import '../styles/Searchbar.css'
import {IoSearchOutline} from 'react-icons/io5'

const Searchbar = ({searchText, setSearchText}) => {
  return (
    <div className='search-bar'>
      <div className='search-icon-container'>
        <IoSearchOutline size={28} color='#b6b6b6' />
      </div>
      <input 
      type="text" 
      value={searchText}
      onChange={e => setSearchText(e.target.value)}
      className='search-input' 
      placeholder='Seach Article'/>

    </div>
  )
}

export default Searchbar
