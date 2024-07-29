import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable'; 
import './assets/StartGame.css';
import correctSound from './assets/correct.mp3';
import wrongSound from './assets/wrong.mp3';

function Pontuacao({ pontuacao }) {
    return (
        <div className="pontuacao">
            <p>Pontuação: {pontuacao}</p>
        </div>
    );
}

function Feedback({ feedback }) {
    if (!feedback) return null;

    const isMobile = window.innerWidth <= 767;

    return (
        <div className={`feedback-message ${isMobile ? 'mobile' : ''}`}>
            <p>{feedback}</p>
        </div>
    );
}

const StartGame = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [pontuacao, setPontuacao] = useState(() => {
        const savedPontuacao = localStorage.getItem('pontuacao');
        return savedPontuacao ? Number(savedPontuacao) : 0;
    });
    const [respostaCorreta, setRespostaCorreta] = useState('');
    const [count, setCount] = useState(0);
    const [timerRunning, setTimerRunning] = useState(true);
    // eslint-disable-next-line
    const [elapsedTime, setElapsedTime] = useState(0);
    const [streak, setStreak] = useState(0);
    const [bonusMessage, setBonusMessage] = useState('');
    const [isSwipeDisabled, setIsSwipeDisabled] = useState(false);
    const [feedback, setFeedback] = useState(''); 

    const bonusMessages = [
        "Bônus de 5 pontos! Excelente!",
        "Uau! +5 pontos de bônus pela sua streak!",
        "Parabéns! Sua streak lhe rendeu +5 pontos extras!"
    ];

    const fetchQuestions = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/perguntas');
            setQuestions(response.data);
            if (response.data[currentQuestionIndex]) {
                setRespostaCorreta(response.data[currentQuestionIndex].resposta_correta);
            } else {
                console.error('Índice da pergunta fora dos limites:', currentQuestionIndex);
                setCurrentQuestionIndex(0);
            }
        } catch (error) {
            console.error('Erro ao buscar perguntas:', error);
        }
    }, [currentQuestionIndex]);

    const fetchPontuacao = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:3000/user/pontuacao', {
                headers: {
                    userid: userId
                }
            });
            const fetchedPontuacao = Number(response.data);
            setPontuacao(isNaN(fetchedPontuacao) ? 0 : fetchedPontuacao);
            localStorage.setItem('pontuacao', fetchedPontuacao);
        } catch (error) {
            console.error('Error fetching pontuacao:', error);
        }
    }, [userId]);

    useEffect(() => {
        fetchQuestions();
        fetchPontuacao();
    }, [currentQuestionIndex, fetchQuestions, fetchPontuacao]);

    useEffect(() => {
        let timer = null;
        if (timerRunning) {
            timer = setInterval(() => {
                setCount(prevCount => prevCount + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timerRunning]);

    useEffect(() => {
        if (bonusMessage) {
            const timeout = setTimeout(() => {
                setBonusMessage('');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [bonusMessage]);

    useEffect(() => {
        setElapsedTime(0);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (questions[currentQuestionIndex]) {
            setRespostaCorreta(questions[currentQuestionIndex].resposta_correta);
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        window.addEventListener('online', syncPontuacao);
        return () => {
            window.removeEventListener('online', syncPontuacao);
        };
    }, []);

    const syncPontuacao = async () => {
        const localPontuacao = localStorage.getItem('pontuacao');
        if (localPontuacao) {
            try {
                const response = await axios.put('http://localhost:3000/user/pontuacao', {
                    userId: userId,
                    pontuacao: Number(localPontuacao)
                });
                const updatedPontuacao = Number(response.data);
                setPontuacao(isNaN(updatedPontuacao) ? pontuacao : updatedPontuacao);
            } catch (error) {
                console.error('Erro ao sincronizar pontuação:', error);
            }
        }
    };

    const playCorrectSound = () => {
        const audio = new Audio(correctSound);
        audio.play();
    };

    const playWrongSound = () => {
        const audio = new Audio(wrongSound);
        audio.play();
    };

    const handleSwipeLeft = async () => {
        if (isSwipeDisabled) return;
        setIsSwipeDisabled(true);
        console.log('Esquerda');
        if (respostaCorreta === 'Não') {
            playCorrectSound();
            await atualizarPontuacao();
            setStreak(prevStreak => prevStreak + 1);
            console.log('Streak:', streak + 1);
            setFeedback('Resposta correta!');
        } else {
            playWrongSound();
            setStreak(0);
            setFeedback('Resposta incorreta!');
        }
        setTimerRunning(true);
        setCount(0);
        const card = document.querySelector('.card');
        if (card) {
            card.classList.add('rotate-left');
            setTimeout(() => {
                card.classList.remove('rotate-left');
                card.classList.add('return');
                setTimeout(() => {
                    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
                    setIsSwipeDisabled(false);
                }, 300);
            }, 300);
        } else {
            setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
            setIsSwipeDisabled(false);
        }
        setTimeout(() => setFeedback(''), 3000);
    };

    const handleSwipeRight = async () => {
        if (isSwipeDisabled) return;
        setIsSwipeDisabled(true);
        console.log('Direita');
        if (respostaCorreta === 'Sim') {
            playCorrectSound();
            await atualizarPontuacao();
            setStreak(prevStreak => prevStreak + 1);
            console.log('Streak:', streak + 1);
            setFeedback('Resposta correta!');
        } else {
            playWrongSound();
            setStreak(0);
            setFeedback('Resposta incorreta!');
        }
        setTimerRunning(true);
        setCount(0);
        const card = document.querySelector('.card');
        if (card) {
            card.classList.add('rotate-right');
            setTimeout(() => {
                card.classList.remove('rotate-right');
                card.classList.add('return');
                setTimeout(() => {
                    setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
                    requestAnimationFrame(() => {
                        setIsSwipeDisabled(false);
                    });
                }, 300);
            }, 300);
        } else {
            setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
            setIsSwipeDisabled(false);
        }
        setTimeout(() => setFeedback(''), 3000);
    };

    const atualizarPontuacao = async () => {
        try {
            let pontuacaoAtualizada = pontuacao;
            const perguntaAtual = questions[currentQuestionIndex];
            
            if (count <= 10) { 
                pontuacaoAtualizada += perguntaAtual.pontuacao;
            } else if (count <= 15) { 
                pontuacaoAtualizada += (perguntaAtual.pontuacao - 3);
            } else { 
                pontuacaoAtualizada += (perguntaAtual.pontuacao - 5);
            }
    
            if (streak > 0 && streak % 4 === 0) {
                pontuacaoAtualizada += 4; 
                const randomMessage = bonusMessages[Math.floor(Math.random() * bonusMessages.length)];
                setBonusMessage(randomMessage);
            }

            localStorage.setItem('pontuacao', pontuacaoAtualizada);
            setPontuacao(pontuacaoAtualizada);
            
            if (navigator.onLine) {
                const response = await axios.put('http://localhost:3000/user/pontuacao', {
                    userId: userId,
                    pontuacao: pontuacaoAtualizada
                });

                const updatedPontuacao = Number(response.data);
                setPontuacao(isNaN(updatedPontuacao) ? pontuacao : updatedPontuacao);
            }
        } catch (error) {
            console.error('Erro ao atualizar pontuação:', error);
        }
    };

    const handleExitGame = () => {
        navigate('/home');
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleSwipeLeft,
        onSwipedRight: handleSwipeRight,
        preventScrollOnSwipe: true,
    });

    return (
        <div {...handlers} style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Pontuacao pontuacao={pontuacao} />
            <button className="exit-button" onClick={handleExitGame} style={{ position: 'absolute', top: '10px', left: '10px' }}>Sair da Partida</button>
            {bonusMessage && (
                <div className="bonus-message" style={{ position: 'fixed', top: '50px', left: '50%', transform: 'translateX(-50%)', zIndex: '9999', background: '#ffffff', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                    {bonusMessage}
                </div>
            )}
            <Feedback feedback={feedback} />
            <div className="card-container">
                {questions.length > 0 && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length && (
                    <TinderCard
                        className="swipe"
                        key={questions[currentQuestionIndex].id}
                        preventSwipe={['up', 'down']}
                        swipeRequirementType="position"
                    >
                        <div className="card">
                            <h2>{questions[currentQuestionIndex].pergunta}</h2>
                        </div>
                    </TinderCard>
                )}
                <div className="arrows">
                    <div className="arrow left" onClick={handleSwipeLeft}>{'<'}</div>
                    <div className="arrow right" onClick={handleSwipeRight}>{'>'}</div>
                </div>
            </div>
        </div>
    );
};

export default StartGame;