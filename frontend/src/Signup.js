import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Validation from './SignupValidation';
import axios from 'axios';
import fundo from './assets/fundo.png';

function Signup() {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loginButtonStyle, setLoginButtonStyle] = useState({
        color: '#14233b',
        borderColor: '#14233b'
    });

    const handleInput = (event) => {
        setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formErrors = Validation(values);
        setErrors(formErrors);

        if (Object.values(formErrors).every(error => error === '')) {
            //axios.post('https://jogo-decisao-backend.onrender.com/signup', values)
            axios.post('http://localhost:3000/signup', values)
            .then(res => {
                if (res.data === "Success") {
                    toast.success("Cadastro realizado com sucesso!");
                    navigate('/');
                } else if (res.data === "User already exists") {
                    toast.error("Nome ou email já estão em uso. Por favor, escolha outros.");
                }
            })
            .catch(err => console.log(err));
        }
    };

    return (
        <div className='container-fluid' style={{ backgroundImage: `url(${fundo})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className='col-md-6 col-lg-4'>
                <div className='bg-white p-3 rounded'>
                    <h2 className='text-center'>Registro</h2>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor='name'><strong>Nome</strong></label>
                            <input
                                type='text'
                                placeholder='Inserir Nome'
                                name='name'
                                onChange={handleInput}
                                className='form-control'
                            />
                            {errors.name && <span className='text-danger'> {errors.name}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='email'><strong>Email</strong></label>
                            <input
                                type='email'
                                placeholder='Inserir Email'
                                name='email'
                                onChange={handleInput}
                                className='form-control'
                            />
                            {errors.email && <span className='text-danger'> {errors.email}</span>}
                        </div>
                        <div className='mb-3'>
                            <label htmlFor='password'><strong>Senha</strong></label>
                            <input
                                type='password'
                                placeholder='Inserir Senha'
                                name='password'
                                onChange={handleInput}
                                className='form-control'
                            />
                            {errors.password && <span className='text-danger'> {errors.password}</span>}
                        </div>
                        <button className='btn btn-success w-100'><strong>Registrar</strong></button>
                        <p></p>
                        <Link
                            to="/"
                            className='btn btn-outline-primary w-100'
                            style={loginButtonStyle}
                            onMouseEnter={() => setLoginButtonStyle({ backgroundColor: '#14233b', color: '#fff', borderColor: '#14233b' })}
                            onMouseLeave={() => setLoginButtonStyle({ backgroundColor: 'transparent', color: '#14233b', borderColor: '#14233b' })}
                        >
                            <strong>Login</strong>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;