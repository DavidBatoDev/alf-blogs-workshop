import React from 'react'
import '../styles/CtaSection.css'
import Button from './Button'

const CtaSection = () => {
  return (
    <div className='cta-section' id='ctaSection'>
        <h1 className='cta-section-heading'>Hurry up and join our newsletter~</h1>
        <h2 className='cta-section-subheading'>
            Only at Alf Blogs. You can learn more about different topics regarding web whikle also learning about everything cloud!
        </h2>
        <Button variants="primary" size='lg'>
            Get Started
        </Button>
    </div>
  )
}

export default CtaSection
