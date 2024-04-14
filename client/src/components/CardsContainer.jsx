import React from 'react'
import '../styles/CardsContainer.css'
import MainCard from './MainCard'
import RegularCard from './RegularCard'

const CardsContainer = () => {
  return (
    <div className='article-cards-container'>
        <MainCard title={"All about "} date='Apr 14, 2024' />
        <RegularCard title='Title' date="April 14, 2023" cover_photo={'card-1.png'} />
    </div>
  )
}

export default CardsContainer
