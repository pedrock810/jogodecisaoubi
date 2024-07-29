const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // a senha do MySQL, se houver
    database: 'quiz'
});

//REGISTRO E LOGIN
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, data) => {
        if (err) {
            return res.json("Error");
        }

        if (data.length > 0) {
            return res.json("Usuário já existe!");
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.json("Error");
            }

            const insertUserQuery = "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)";
            const values = [name, email, hash];

            db.query(insertUserQuery, values, (err, data) => {
                if (err) {

                    return res.json("Error");
                }
                return res.json("Success");
            });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE `email` = ?";
    
    db.query(sql, [email], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            const user = data[0];
            
            bcrypt.compare(password, user.senha, (err, result) => {
                if (err) {
                    return res.json("Error");
                }
                
                if (result) {
                    if (user.isAdmin === 1) {
                        return res.json({ message: "Success", isAdmin: user.isAdmin, nome: user.nome, userId: user.id });
                    } else {
                        const checkPontuacaoQuery = "SELECT * FROM pontuacoes WHERE user_id = ?";
                        db.query(checkPontuacaoQuery, [user.id], (err, pontuacaoData) => {
                            if (err) {
                                return res.json("Error");
                            }

                            if (pontuacaoData.length === 0) {
                                const insertPontuacaoQuery = "INSERT INTO pontuacoes (user_id, pontuacao) VALUES (?, 0)";
                                db.query(insertPontuacaoQuery, [user.id], (err, pontuacaoInsertData) => {
                                    if (err) {
                                        return res.json("Error");
                                    }
                                    return res.json({ message: "Success", isAdmin: user.isAdmin, nome: user.nome, userId: user.id });
                                });
                            } else {
                                return res.json({ message: "Success", isAdmin: user.isAdmin, nome: user.nome, userId: user.id });
                            }
                        });
                    }
                } else {
                    return res.json("Failed");
                }
            });
        } else {
            return res.json("Failed");
        }
    });
});

//BACKOFFICE
app.get('/admin/users', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.put('/admin/users/:id', (req, res) => {
    const { name, email, isAdmin } = req.body;
    const userId = req.params.id;

    const sql = "UPDATE users SET nome=?, email=?, isAdmin=? WHERE id=?";
    const values = [name, email, isAdmin, userId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.delete('/admin/users/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = "DELETE FROM users WHERE id = ?";
    
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.get('/admin/perguntas', (req, res) => {
    const sql = "SELECT * FROM perguntas";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    })
});

app.post('/admin/perguntas', (req, res) => {
    const { pergunta, opcoes_resposta, resposta_correta, pontuacao } = req.body;

    const insertQuestionQuery = "INSERT INTO perguntas (pergunta, opcoes_resposta, resposta_correta, pontuacao) VALUES (?, ?, ?, ?)";
    const values = [pergunta, opcoes_resposta, resposta_correta, pontuacao];

    db.query(insertQuestionQuery, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.put('/admin/perguntas/:id', (req, res) => {
    const { pergunta, resposta_correta, pontuacao, opcoes_resposta } = req.body;
    const perguntasId = req.params.id;

    const sql = "UPDATE perguntas SET pergunta=?, resposta_correta=?, pontuacao=?, opcoes_resposta=? WHERE id=?";
    const values = [pergunta, resposta_correta, pontuacao, opcoes_resposta, perguntasId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.delete('/admin/perguntas/:perguntasId', (req, res) => {
    const perguntasId = req.params.perguntasId;

    const sql = "DELETE FROM perguntas WHERE id = ?";
    
    db.query(sql, [perguntasId], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.get('/admin/rewards', (req, res) => {
    const sql = "SELECT * FROM recompensas";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.post('/admin/rewards', (req, res) => {
    const { nome, custo, descricao } = req.body;

    const insertRewardQuery = "INSERT INTO recompensas (nome, custo, descricao) VALUES (?, ?, ?)";
    const values = [nome, custo, descricao];

    db.query(insertRewardQuery, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.put('/admin/rewards/:id', (req, res) => {
    const { nome, custo, descricao } = req.body;
    const rewardId = req.params.id;

    const sql = "UPDATE recompensas SET nome=?, custo=?, descricao=? WHERE id=?";
    const values = [nome, custo, descricao, rewardId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.delete('/admin/rewards/:rewardId', (req, res) => {
    const rewardId = req.params.rewardId;

    const sql = "DELETE FROM recompensas WHERE id = ?";
    
    db.query(sql, [rewardId], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

//JOGO
app.get('/user/pontuacao', (req, res) => {
    const userId = req.headers.userid;

    const sql = "SELECT pontuacao FROM pontuacoes WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data[0].pontuacao);
    });
});

app.put('/user/pontuacao', (req, res) => {
    const { userId, pontuacao } = req.body;

    const sql = "UPDATE pontuacoes SET pontuacao = ? WHERE user_id = ?";
    const values = [pontuacao, userId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

app.get('/ranking', (req, res) => {
    const sql = `
        SELECT u.nome, p.pontuacao
        FROM users u
        JOIN pontuacoes p ON u.id = p.user_id
        ORDER BY p.pontuacao DESC
    `;
    db.query(sql, (err, data) => {
        if (err) {
            return res.status(500).json("Error fetching ranking");
        }
        return res.json(data);
    });
});

// Rota para salvar uma recompensa comprada pelo usuário
app.post('/user/recompensas', (req, res) => {
    const { userId, recompensaId } = req.body;

    const sql = "INSERT INTO recompensas_compradas (user_id, recompensa_id) VALUES (?, ?)";
    const values = [userId, recompensaId];

    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json("Success");
    });
});

// Rotas para lidar com as recompensas compradas pelos usuários
app.get('/user/:userId/recompensas', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT r.*
        FROM recompensas_compradas rc
        JOIN recompensas r ON rc.recompensa_id = r.id
        WHERE rc.user_id = ?
    `;
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error('Erro ao obter as recompensas do usuário:', err);
            return res.status(500).json("Erro ao obter as recompensas do usuário");
        }
        return res.json(data);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Funcionando na porta ${PORT}`);
})