import React, { useState } from 'react';
import { Register } from './Register';

const Login = ({ setShowContent, setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('https://thejunger.pythonanywhere.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setToken(data.access_token);
      setShowContent(true); // Solo mostrar contenido si las credenciales son válidas
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      {showRegister ? <Register setToken={setToken} setShowRegister={setShowRegister} /> : null}
      <div className='loginContainer'>
        <form className='formlogincontainer' onSubmit={handleSubmit}>
          <div className='formlogintitle'>Iniciar Sesion</div>
          <label>
            <div>Nombre de Usuario:</div>
            <input className='formlogininput' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            <div>Contraseña:</div>
            <input className='formlogininput' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className='formloginregister' onClick={() => setShowRegister(true)}>Registrarse</div>
          <button className='formloginbutton' type="submit">Entrar</button>
        </form>
      </div>
    </>
  );
};

export default Login;
