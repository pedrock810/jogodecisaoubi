import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Validation from './LoginValidation';
import axios from 'axios';
import fundo from './assets/fundo.png';

function Login({ setIsLoggedIn, isLoggedIn, setUserName }) {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [signupButtonStyle, setSignupButtonStyle] = useState({
        color: '#14233b',
        borderColor: '#14233b'
    });

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors(Validation(values));

        if (errors.email === "" && errors.password === "") {
            //axios.post('https://jogo-decisao-backend.onrender.com/login', values)
            axios.post('http://localhost:3000/login', values)
                .then(res => {
                    if (res.data.message === "Success") {
                        setIsLoggedIn(true);
                        setUserName(res.data.nome);
                        localStorage.setItem('userId', res.data.userId);
                        if (res.data.isAdmin === 1) {
                            navigate('/admin');
                            toast.success("Login realizado com sucesso!");
                        } else {
                            navigate('/home');
                            toast.success("Login realizado com sucesso!");
                        }
                    } else {
                        toast.error("Credenciais inválidas. Por favor, tente novamente.");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    if (isLoggedIn) {
        return <navigate to="/home" />;
    }

    return (
        <div className='container-fluid' style={{ backgroundImage: `url(${fundo})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className='col-md-6 col-lg-4'>
                <div className='bg-white p-3 rounded'>
                    <h2 className='text-center'>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='email'><strong>Email</strong></label>
                            <input type='email' placeholder='Inserir Email' name='email'
                                onChange={handleInput} className='form-control'></input>
                            {errors.email && <span className='text-danger'>{errors.email}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password'><strong>Senha</strong></label>
                            <input type='password' placeholder='Inserir Senha' name='password'
                                onChange={handleInput} className='form-control'></input>
                            {errors.password && <span className='text-danger'>{errors.password}</span>}
                        </div>
                        <button type='submit' className='btn btn-success w-100'><strong>Entrar</strong></button>
                        <p></p>
                        <Link
                            to="/signup"
                            className='btn btn-outline-primary w-100'
                            style={signupButtonStyle}
                            onMouseEnter={() => setSignupButtonStyle({ backgroundColor: '#14233b', color: '#fff', borderColor: '#14233b' })}
                            onMouseLeave={() => setSignupButtonStyle({ backgroundColor: 'transparent', color: '#14233b', borderColor: '#14233b' })}
                        >
                            <strong>Criar Conta</strong>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
