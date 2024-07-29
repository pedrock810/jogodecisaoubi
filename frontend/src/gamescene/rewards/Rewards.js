import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Pontuacao({ pontuacao }) {
    return (
        <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '999' }}>
            <p>Pontuação: {pontuacao}</p>
        </div>
    );
}

function Rewards() {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;
    const [pontuacao, setPontuacao] = useState(0);
    const [rewards, setRewards] = useState([]);

    const fetchPontuacao = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/user/pontuacao', {  // Ajuste a URL conforme necessário
                headers: {
                    userid: userId
                }
            });
            setPontuacao(response.data);
        } catch (error) {
            console.error('Error fetching pontuacao:', error);
        }
    }, [userId]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchPontuacao();
            try {
                const response = await axios.get('http://localhost:3000/admin/rewards');  // Ajuste a URL conforme necessário
                setRewards(response.data);
            } catch (error) {
                console.error('Erro ao obter as recompensas:', error);
            }
        };
        fetchData();
    }, [fetchPontuacao]);

    const handleBuyReward = async (reward) => {
        if (pontuacao >= reward.custo) {
            try {
                const updatedPontuacao = pontuacao - reward.custo;
                await axios.put('http://localhost:3000/user/pontuacao', {   
                    userId: userId,
                    pontuacao: updatedPontuacao
                });
                setPontuacao(updatedPontuacao);
    
                await axios.post('http://localhost:3000/user/recompensas', {  
                    userId: userId,
                    recompensaId: reward.id
                });
    
                toast.success(`Recompensa "${reward.nome}" comprada com sucesso!`);
            } catch (error) {
                console.error('Erro ao comprar recompensa:', error);
                toast.error('Erro ao comprar recompensa. Por favor, tente novamente mais tarde.');
            }
        } else {
            toast.error('Você não possui pontuação suficiente para comprar esta recompensa.');
        }
    };

    const handleExitGame = () => {
        navigate('/home');
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <Pontuacao pontuacao={pontuacao} />
            <button className="exit-button" onClick={handleExitGame} style={{ position: 'absolute', top: '10px', left: '10px' }}>Voltar</button>
            <h1 style={{ textAlign: 'center' }}>Recompensas Disponíveis</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {rewards.map(reward => (
                    <div key={reward.id} style={cardStyle}>
                        <h3>{reward.nome}</h3>
                        <p style={{ fontSize: '14px' }}>{reward.descricao}</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{reward.custo} pontos</p>
                        <button onClick={() => handleBuyReward(reward)}>Comprar</button>
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

export default Rewards;
