import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Ranking() {
    const [ranking, setRanking] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRanking();
    }, []);

    const fetchRanking = async () => {
        try {
            const response = await axios.get('http://localhost:3000/ranking');
            setRanking(response.data);
        } catch (error) {
            console.error('Error fetching ranking:', error);
        }
    };

    const handleExitGame = () => {
        navigate('/home');
    };

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
        <button className="exit-button" onClick={handleExitGame} style={{ position: 'absolute', top: '10px', left: '10px' }}>Voltar</button>

            <h1>Ranking dos Jogadores</h1>
            <div style={{ marginTop: "20px" }}>
                <table style={{ margin: 'auto' }}>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome do Jogador</th>
                            <th>Pontuação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((player, index) => (
                            <tr key={index}>
                                <td style={tableCellStyle}>{index + 1}</td>
                                <td style={tableCellStyle}>{player.nome}</td>
                                <td style={tableCellStyle}>{player.pontuacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const tableCellStyle = {
    padding: '10px',
    textAlign: 'center',
};

export default Ranking;