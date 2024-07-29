import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './style/Admin.css';

function Admin({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleOutsideClick = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            closeMenu();
        }
    };

    useEffect(() => {
        if (menuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuOpen]);

    useEffect(() => {
        closeMenu();
    }, [location]);

    return (
        <div className="admin-container">
            <button className="menu-toggle" onClick={toggleMenu}>
                <span className="menu-icon"></span>
                <span className="menu-icon"></span>
                <span className="menu-icon"></span>
            </button>
            <div className={`sidebar ${menuOpen ? 'open' : ''}`} ref={sidebarRef}>
                <h2>Admin Menu</h2>
                <ul>
                    <li><Link to="/admin">Página Inicial</Link></li>
                    <li><Link to="/admin/users">Gerenciar Utilizadores</Link></li>
                    <li><Link to="/admin/answers">Gerenciar Perguntas</Link></li>
                    <li><Link to="/admin/rewards">Gerenciar Recompensas</Link></li>
                    <li><button className="logout-btn" onClick={handleLogout}>Sair</button></li>
                </ul>
            </div>
            <div className="content">
                <h1>Bem vindo ao Backoffice!</h1>
                <p>Aqui você pode gerenciar utilizadores e perguntas do sistema.</p>
                <Outlet />
            </div>
        </div>
    );
}

export default Admin;