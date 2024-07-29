import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './assets/Tutorial.css';

const Tutorial = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line
    const location = useLocation();

    const handleExitGame = () => {
        navigate('/home');
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: "50px" }}>
            <button className="exit-button" onClick={handleExitGame} style={{ position: 'absolute', top: '10px', left: '10px' }}>Voltar</button>
            <h1>Tutorial</h1>
            <p>Bem-vindo ao tutorial do Jogo de Decisão da Universidade da Beira Interior!</p>
            <ol className="tutorial-steps">
                <li>Ao iniciar o jogo, você verá uma pergunta no cartão central.</li>
                <li>Para responder a pergunta, deslize o cartão para a esquerda se a resposta for "Não" ou para a direita se a resposta for "Sim".</li>
                <li>Você pode usar os botões de seta na tela ou simplesmente deslizar o cartão com o dedo (em dispositivos móveis) ou o rato.</li>
                <li>A cada resposta correta, sua pontuação será atualizada. A pontuação depende do tempo que você levou para responder:</li>
                <ul>
                    <li>Respostas em até 10 segundos: pontuação completa.</li>
                    <li>Respostas entre 11 e 15 segundos: pontuação reduzida em 3 pontos.</li>
                    <li>Respostas após 15 segundos: pontuação reduzida em 5 pontos.</li>
                </ul>
                <li>Se você acertar múltiplas perguntas consecutivas, você poderá ganhar bônus de pontos:</li>
                <ul>
                    <li>A cada 5 respostas corretas consecutivas, você ganha um bônus de 5 pontos!</li>
                </ul>
                <li>Você pode sair do jogo a qualquer momento clicando no botão "Sair do Jogo" no canto superior esquerdo.</li>
                <li>Ao final do jogo, você pode trocar seus pontos por recompensas físicas da Universidade da Beira Interior.</li>
                <li>Divirta-se e boa sorte!</li>
            </ol>
        </div>
    );
};

export default Tutorial;