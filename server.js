const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;
require("dotenv").config({path: "./env"});
// Middleware
app.use(cors());
app.use(express.json());

const REDMINE_URL = 'http://172.22.129.226/redmine';
const API_KEY = process.env.API_KEY;


app.post('/issues', async (req, res) => {
    try {
        const { data } = await axios.post(`${REDMINE_URL}/issues.json`, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'X-Redmine-API-Key': API_KEY
            }
        });
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al crear el issue:', error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Error interno del servidor' });
    }
});

app.get('/issues', async (req, res) => {
    const { project_id } = req.query;
    
    if (!project_id) {
        return res.status(400).json({ error: 'El parámetro project_id es obligatorio' });
    }
    
    try {
        const { data } = await axios.get(`${REDMINE_URL}/issues.json?project_id=${project_id}`, {
            headers: {
                'X-Redmine-API-Key': API_KEY
            }
        });
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al listar issues:', error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy corriendo en http://localhost:${PORT}`);
});
