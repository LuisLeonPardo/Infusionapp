import React from 'react'
import "../styles/Landing.css";
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className='landing-main'>
    <h1>ALCOLABS</h1>
    <p>Hola, y Bienvenidos!</p>
    <Link to="/login" className="landing-login-button">Acceder</Link>
    <Link to="/register" className="landing-register-button">Registrarse</Link>
  </div>
  )
}

export default Landing