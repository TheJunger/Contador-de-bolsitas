import React, { useState } from 'react';

const Register = ({ setToken, setShowRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://thejunger.pythonanywhere.com/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            setToken(data.access_token);
        } else {
            alert(data.message);
        }
    };

    return (
        <div className='loginContainer'>
            <form className='formlogincontainer' onSubmit={handleSubmit}>
                <div className='formlogintitle'>Registrarse</div>
                <label>
                    <div>Nombre de Usuario:</div>
                    <input className='formlogininput' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    <div>Contraseña:</div>
                    <input className='formlogininput' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <div onClick={() => setShowRegister(false)} className='formloginregister'>¿Iniciar sesion?</div>
                <button className='formloginbutton' type="submit">Registrarse</button>
            </form>
        </div>
    );
};

export {Register};
