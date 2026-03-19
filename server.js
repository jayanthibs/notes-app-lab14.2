import 'dotenv/config'

import express from 'express'

import './config/connection.js'

import noteRoutes from './routes/noteRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express();
const PORT = process.env.PORT || 3001;
 
app.use(express.json());

//frontend login page
app.get('/', (req, res) => res.send('<a href="/api/users/auth/github"><button>Login with GitHub</button></a>'));
//frontend success page
app.get('/success', (req, res) => res.send('<h1>Success!</h1><a href="/">Back</a>'));
 
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
 
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));