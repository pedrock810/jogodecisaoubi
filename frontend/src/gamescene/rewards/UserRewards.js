import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserRewards({ userId }) {
    const [userRewards, setUserRewards] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRewards = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/user/${userId}/recompensas`);
                setUserRewards(response.data);
            } catch (error) {
                console.error('Erro ao obter as recompensas do usuário:', error);
                toast.error('Erro ao obter as recompensas do usuário. Por favor, tente novamente mais tarde.');
            }
        };

        fetchUserRewards();
    }, [userId]);

    const handleExitGame = () => {
        navigate('/home');
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <button className="exit-button" onClick={handleExitGame} style={{ position: 'absolute', top: '10px', left: '10px' }}>Voltar</button>
            <h1 style={{ textAlign: 'center' }}>Suas Recompensas Compradas</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {userRewards.map(reward => (
                    <div key={reward.id} style={cardStyle}>
                        <h3>{reward.nome}</h3>
                        <p style={{ fontSize: '14px' }}>{reward.descricao}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const cardStyle = {
    backgroundColor: '#f4f4f4',
    padding: '20px',
    margin: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '300px',
};

export default UserRewards;