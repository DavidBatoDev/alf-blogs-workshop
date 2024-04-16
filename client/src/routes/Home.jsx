import React from 'react'
import Hero from '../components/Hero'
import ArticleSection from '../components/ArticleSection'
import CtaSection from '../components/CtaSection'

const Home = () => {
  return (
    <div className='wrapper'>
        <Hero />
        <ArticleSection />
        <CtaSection />
    </div>
  )
}

export default Home
