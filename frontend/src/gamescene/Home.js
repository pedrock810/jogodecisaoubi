import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from './ubi.jpg'; 

function Home({ userName, setIsLoggedIn, userId }) {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 600); 
        };

        handleResize(); 
        window.addEventListener('resize', handleResize); 

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div style={{ padding: "50px", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <div style={{ marginRight: isMobile ? "0" : "50px", textAlign: isMobile ? "center" : "left" }}>
            <h1>Bem-vindo, {userName}!</h1>
            <div style={{ marginTop: "20px", display: "flex", flexDirection: isMobile ? "column" : "column", alignItems: "flex-start" }}>
                <Link to="/start-game" state={{ userId: userId }}>
                    <button style={isMobile ? verticalButtonStyle : buttonStyle}>Iniciar Jogo</button>
                </Link>
                <Link to="/ranking">
                    <button style={isMobile ? verticalButtonStyle : buttonStyle}>Ranking dos Jogadores</button>
                </Link>
                <Link to="/rewards" state={{ userId: userId }}>
                    <button style={isMobile ? verticalButtonStyle : buttonStyle}>Recompensas</button>
                </Link>
                <Link to="/user-rewards"> 
                    <button style={isMobile ? verticalButtonStyle : buttonStyle}>Suas Recompensas</button>
                </Link>
                <Link to="/tutorial">
                    <button style={isMobile ? verticalButtonStyle : buttonStyle}>Tutorial e Regras</button>
                </Link>
                <button style={isMobile ? verticalLogoutButtonStyle : logoutButtonStyle} onClick={handleLogout}>Sair</button>
            </div>
            </div>
            {!isMobile && <img src={logoImage} alt="Imagem para PCs" style={{ marginTop: "50px", maxWidth: "300px"}} />}
        </div>
    );
}

const buttonStyle = {
    marginRight: "10px",
    marginBottom: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#14233b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "200px",
};

const verticalButtonStyle = {
    ...buttonStyle,
    display: 'block',   
    width: '300px',
};

const logoutButtonStyle = {
    marginRight: "10px",
    marginBottom: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    width: "200px",
};

const verticalLogoutButtonStyle = {
    ...logoutButtonStyle,
    display: 'block',
    width: '300px',
    marginTop: "10px"
};

export default Home;