import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './style/Admin.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function AnswersManage({ setIsLoggedIn }) {
    const [data, setData] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null); // eslint-disable-line
    const [editedQuestionInfo, setEditedQuestionInfo] = useState({
        id: '',
        pergunta: '',
        opcoes_resposta: '',
        resposta_correta: '',
        pontuacao: 10 
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [questionIdToDelete, setQuestionIdToDelete] = useState(null);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [newQuestionInfo, setNewQuestionInfo] = useState({
        pergunta: '',
        opcoes_resposta: '["Sim", "Não"]',
        resposta_correta: '',
        pontuacao: 10 
    });

    const [menuOpen, setMenuOpen] = useState(false);

    const sidebarRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetch('http://localhost:3000/admin/perguntas')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    }, []);

    const handleOpenCreateModal = () => {
        setNewQuestionInfo({
            pergunta: '',
            opcoes_resposta: '["Sim", "Não"]',
            resposta_correta: '',
            pontuacao: 10
        });
        setOpenCreateModal(true);
    };    

    const handleCreateQuestion = (event) => {
        event.preventDefault();
    
        if (newQuestionInfo.resposta_correta.toLowerCase() !== "sim" && newQuestionInfo.resposta_correta.toLowerCase() !== "não") {
            toast.error("O campo 'Resposta Correta' só pode aceitar 'Sim' ou 'Não'.");
            return;
        }
    
        axios.post('http://localhost:3000/admin/perguntas', newQuestionInfo)
            .then(res => {
                if (res.data === "Success") {
                    fetch('http://localhost:3000/admin/perguntas')
                        .then(res => res.json())
                        .then(data => setData(data))
                        .catch(err => console.log(err));
                    setOpenCreateModal(false);
                } else {
                    toast.error("Ocorreu um erro ao tentar criar a pergunta. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleEdit = (question) => {
        setEditingQuestion(question);
        setEditedQuestionInfo({
            id: question.id,
            pergunta: question.pergunta,
            opcoes_resposta: question.opcoes_resposta,
            resposta_correta: question.resposta_correta,
            pontuacao: 10 
        });
        setOpenEditModal(true);
    };

    const handleSave = (event) => {
        event.preventDefault();

        if (editedQuestionInfo.resposta_correta.toLowerCase() !== "sim" && editedQuestionInfo.resposta_correta.toLowerCase() !== "não") {
            toast.error("O campo 'Resposta Correta' só pode aceitar 'Sim' ou 'Não'.");
            return;
        }

        axios.put(`http://localhost:3000/admin/perguntas/${editedQuestionInfo.id}`, editedQuestionInfo)
            .then(res => {
                if (res.data === "Success") {
                    const updatedData = data.map(question => {
                        if (question.id === editedQuestionInfo.id) {
                            return editedQuestionInfo;
                        }
                        return question;
                    });
                    setData(updatedData);
                    setEditingQuestion(null);
                    setOpenEditModal(false);
                } else {
                    toast.error("Ocorreu um erro ao tentar salvar as alterações. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setEditedQuestionInfo(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === "resposta_correta" && (value.toLowerCase() !== "sim" && value.toLowerCase() !== "não")) {
            toast.error("O campo 'Resposta Correta' só pode aceitar 'Sim' ou 'Não'.");
        }
    };

    const handleDelete = (questionId) => {
        setQuestionIdToDelete(questionId);
        setOpenDeleteModal(true);
    };

    const confirmDeleteQuestion = () => {
        axios.delete(`http://localhost:3000/admin/perguntas/${questionIdToDelete}`)
            .then(res => {
                if (res.data === "Success") {
                    const updatedData = data.filter(question => question.id !== questionIdToDelete);
                    setData(updatedData);
                    setOpenDeleteModal(false);
                } else {
                    alert("Ocorreu um erro ao tentar excluir a pergunta. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
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
                <h1>Gerenciar Perguntas</h1>
                <button className="create-btn" onClick={handleOpenCreateModal}>Criar Pergunta</button>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Pergunta</th>
                            <th>Resposta Correta</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((question, index) => (
                            <tr key={index}>
                                <td>{question.id}</td>
                                <td>{question.pergunta}</td>
                                <td>{question.resposta_correta}</td>
                                <td><button className="edit-btn" onClick={() => handleEdit(question)}>Editar</button></td>
                                <td><button className="delete-btn" onClick={() => handleDelete(question.id)}>Deletar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <Modal
                    open={openCreateModal}
                    onClose={() => setOpenCreateModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Criar Nova Pergunta
                        </Typography>
                        <form onSubmit={handleCreateQuestion}>
                            <div>
                                <label htmlFor="pergunta">Pergunta:</label>
                                <input type="text" name="pergunta" value={newQuestionInfo.pergunta} onChange={(e) => setNewQuestionInfo({ ...newQuestionInfo, pergunta: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="resposta_correta">Resposta Correta:</label>
                                <input type="text" name="resposta_correta" value={newQuestionInfo.resposta_correta} onChange={(e) => setNewQuestionInfo({ ...newQuestionInfo, resposta_correta: e.target.value })} />
                            </div>
                            <button type="submit">Criar</button>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Editar Pergunta
                        </Typography>
                        <form onSubmit={handleSave}>
                            <div>
                                <label htmlFor="pergunta">Pergunta:</label>
                                <input type="text" name="pergunta" value={editedQuestionInfo.pergunta} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="resposta_correta">Resposta Correta:</label>
                                <input type="text" name="resposta_correta" value={editedQuestionInfo.resposta_correta} onChange={handleChange} />
                            </div>
                            <button type="submit">Salvar</button>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Confirmar exclusão de pergunta
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Tem certeza de que deseja excluir esta pergunta?
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
                            <Button onClick={confirmDeleteQuestion} variant="contained" color="error" style={{ marginLeft: '10px' }}>Excluir</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default AnswersManage;