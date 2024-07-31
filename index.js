const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
const port = 3001;


// const dummy authentification

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const sessionToken = 'secure-session-token'
        res.cookie('authToken', sessionToken, { httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7) // 7 days expiration
         });
        res.status(200).send('Success');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.get('/protected', (req, res) => {
    const authToken = req.cookies.authToken;
    if (authToken === 'secure-session-token') {
        res.status(200).send('Success');
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.status(200).send('Success');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
