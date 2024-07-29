import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './style/Admin.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function RewardsManage({ setIsLoggedIn }) {
    const [data, setData] = useState([]);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [newRewardInfo, setNewRewardInfo] = useState({
        nome: '',
        custo: '',
        descricao: ''
    });
    const [editingReward, setEditingReward] = useState(null); // eslint-disable-line
    const [editedRewardInfo, setEditedRewardInfo] = useState({
        id: '',
        nome: '',
        custo: '',
        descricao: ''
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [rewardIdToDelete, setRewardIdToDelete] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarRef = useRef(null);

    useEffect(() => {
        fetchRewards();
    }, []);

    const fetchRewards = () => {
        fetch('http://localhost:3000/admin/rewards')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.log(err));
    };

    const handleOpenCreateModal = () => {
        setOpenCreateModal(true);
    };

    const handleCreateReward = (event) => {
        event.preventDefault();
        
        if (isNaN(newRewardInfo.custo) || parseInt(newRewardInfo.custo) <= 0) {
            toast.error("O campo 'Custo' deve ser um número maior que zero.");
            return;
        }

        axios.post('http://localhost:3000/admin/rewards', newRewardInfo)
            .then(res => {
                if (res.data === "Success") {
                    fetchRewards();
                    setOpenCreateModal(false);
                } else {
                    toast.error("Ocorreu um erro ao tentar criar a recompensa. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
    };

    const handleEditReward = (reward) => {
        setEditingReward(reward);
        setEditedRewardInfo({
            id: reward.id,
            nome: reward.nome,
            custo: reward.custo,
            descricao: reward.descricao
        });
        setOpenEditModal(true);
    };

    const handleSaveEditReward = (event) => {
        event.preventDefault();
        axios.put(`http://localhost:3000/admin/rewards/${editedRewardInfo.id}`, editedRewardInfo)
            .then(res => {
                if (res.data === "Success") {
                    fetchRewards();
                    setOpenEditModal(false);
                    toast.success("Recompensa atualizada com sucesso!");
                } else {
                    toast.error("Ocorreu um erro ao tentar salvar as alterações. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
    };

    const handleDeleteReward = (rewardId) => {
        setRewardIdToDelete(rewardId);
        setOpenDeleteModal(true);
    };

    const confirmDeleteReward = () => {
        axios.delete(`http://localhost:3000/admin/rewards/${rewardIdToDelete}`)
            .then(res => {
                if (res.data === "Success") {
                    fetchRewards();
                    setOpenDeleteModal(false);
                    toast.success("Recompensa excluída com sucesso!");
                } else {
                    toast.error("Ocorreu um erro ao tentar excluir a recompensa. Por favor, tente novamente.");
                }
            })
            .catch(err => console.log(err));
    };

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
                <h1>Gerenciar Recompensas</h1>
                <button className="create-btn" onClick={handleOpenCreateModal}>Criar Recompensa</button>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nome</th>
                            <th>Custo</th>
                            <th>Descrição</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((reward, index) => (
                            <tr key={index}>
                                <td>{reward.id}</td>
                                <td>{reward.nome}</td>
                                <td>{reward.custo}</td>
                                <td>{reward.descricao}</td>
                                <td><button className="edit-btn" onClick={() => handleEditReward(reward)}>Editar</button></td>
                                <td><button className="delete-btn" onClick={() => handleDeleteReward(reward.id)}>Deletar</button></td>
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
                            Criar Nova Recompensa
                        </Typography>
                        <form onSubmit={handleCreateReward}>
                            <div>
                                <label htmlFor="nome">Nome:</label>
                                <input type="text" name="nome" value={newRewardInfo.nome} onChange={(e) => setNewRewardInfo({ ...newRewardInfo, nome: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="custo">Custo:</label>
                                <input type="text" name="custo" value={newRewardInfo.custo} onChange={(e) => setNewRewardInfo({ ...newRewardInfo, custo: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="descricao">Descrição:</label>
                                <input type="text" name="descricao" value={newRewardInfo.descricao} onChange={(e) => setNewRewardInfo({ ...newRewardInfo, descricao: e.target.value })} />
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
                            Editar Recompensa
                        </Typography>
                        <form onSubmit={handleSaveEditReward}>
                            <div>
                                <label htmlFor="nome">Nome:</label>
                                <input type="text" name="nome" value={editedRewardInfo.nome} onChange={(e) => setEditedRewardInfo({ ...editedRewardInfo, nome: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="custo">Custo:</label>
                                <input type="text" name="custo" value={editedRewardInfo.custo} onChange={(e) => setEditedRewardInfo({ ...editedRewardInfo, custo: e.target.value })} />
                            </div>
                            <div>
                                <label htmlFor="descricao">Descrição:</label>
                                <input type="text" name="descricao" value={editedRewardInfo.descricao} onChange={(e) => setEditedRewardInfo({ ...editedRewardInfo, descricao: e.target.value })} />
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
                            Confirmar exclusão de recompensa
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Tem certeza de que deseja excluir esta recompensa?
                        </Typography>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <Button onClick={() => setOpenDeleteModal(false)}>Cancelar</Button>
                            <Button onClick={confirmDeleteReward} variant="contained" color="error" style={{ marginLeft: '10px' }}>Excluir</Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default RewardsManage;
