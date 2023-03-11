import http from 'http'
import express from 'express';
import path from 'path';

import { v4 as uuidv4 } from 'uuid';

import jwt from 'jsonwebtoken';

import validateToken from './src/middlewares/validate-token.js';

const MockEvents = [
    {
        id: uuidv4(),
        eventDate: new Date(2023, 2, 9, 1, 1, 0),
        eventTitle: "April Fool's Day",
        eventTheme: 'blue',
        startTime: '10:50',
        endTime: '11:20',
        totalHours: '00:30'
    },
    {
        id: uuidv4(),
        eventDate: new Date(2023, 2, 9),
        eventTitle: "Birthday",
        eventTheme: 'red',
        startTime: '10:50',
        endTime: '11:20',
        totalHours: '00:30'
    },
    {
        id: uuidv4(),
        eventDate: new Date(2023, 2, 16),
        eventTitle: "Upcoming Event",
        eventTheme: 'green',
        startTime: '11:30',
        endTime: '11:50',
        totalHours: '00:30'
    }
];

const MockUser = {
    email: "carlos@gmail.com",
    password: "123456"
};

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('src/views/calendar'))
app.use(express.static('src/views/sign-in'))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + '/src/views/calendar/index.html'));
})

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname + '/src/views/sign-in/index.html'));
})

app.get("/calendario", validateToken, (req, res) => {
    res.sendFile(path.join(__dirname + '/src/views/calendar/index.html'));
})

app.get("/api/calendar",  (req, res, next) => {
    res.status(200).json(MockEvents);
})

app.post("/api/calendar", (req, res) => {


    const data = { id, eventDate, eventTitle, eventTheme, startTime, endTime, totalHours } = req.body;

    data.id = uuidv4();

    MockEvents.push(data);

    res.status(200).json(data);
});

app.put("/api/calendar/:id", (req, res) => {

    const data = { id, eventDate, eventTitle, eventTheme, startTime, endTime, totalHours } = req.body;

    data.id = uuidv4();
    MockEvents.push(data);

    res.status(200).json(data);
})

app.post("/api/sign-in", (req, res) => {

    if (req.body.email === MockUser.email && req.body.password === MockUser.password) {

        const id = uuidv4();
        const token = jwt.sign({ id }, "123456", {
            expiresIn: 100
        });
        return res.json({ auth: true, token: token });
    }

    res.status(500).json({ message: 'Login inválido!' });
})

app.post("/api/sign-up", (req, res) => {

    const data = { id, eventDate, eventTitle, eventTheme, startTime, endTime, totalHours } = req.body;

    data.id = uuidv4();
    events.push(data);
    console.log(events)

    res.json(200, data);
});

app.get("/api/profile/:id", (req, res) => {

    const data = { id, eventDate, eventTitle, eventTheme, startTime, endTime, totalHours } = req.body;

    data.id = uuidv4();
    events.push(data);


    res.json(200, data);
})

const server = http.createServer(app);
server.listen(PORT);
