import React from 'react'
import "../styles/Button.css"

const theme = {
  primary: 'btn__primary',
  outlined: 'btn__outlined',
  destructive: 'btn__destructive',
  icon: 'btn__icon',
  accent: 'btn__accent',
}

const sizes = {
    icon: 'btn__size__icon',
    sm: 'btn__size__sm',
    md: 'btn__size__md',
    lg: 'btn__size__lg',

}

const Button = ({children, variants, size, active, ...props}) => {

    const activeClassname = active ? 'active' : ''
    const newClassname = active ?? 'active'


  return (
    <button className={
        `${theme[variants]} 
        ${sizes[size]} 
        ${sizes[size] ?? sizes.sm} 
        ${activeClassname} 
        ${newClassname}`
        } {...props}>
        {children}
    </button>
  )
}

export default Button
