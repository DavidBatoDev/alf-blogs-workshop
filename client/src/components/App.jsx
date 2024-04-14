import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Hero from './Hero'
import ArticleSection from './ArticleSection'
import CardsContainer from './CardsContainer'
import CtaSection from './CtaSection'

function App() {
  return (
    <div className='wrapper'>
      <Navbar />
      <Hero />
      <ArticleSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default App
