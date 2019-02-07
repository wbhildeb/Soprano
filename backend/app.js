const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) =>
{
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader(
        "Access-Control-Allow-Headers",
        'Origin, X-Request-With, Content-Type, Accept'
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    )
    next();
});

app.post("/api/artists", (req, res, next) =>
{
    const artist = req.body;
    console.log(artist);
    res.status(201).json({
        message: 'Artist sucessfully ignored'
    });
});

app.get("/api/artists", (req, res, next) => {
    const artists = 
    [
        {
            id: "ajlkjdlajsld",
            name: "Rainbow Kitten Surprise",
            minutesListened: 600,
            topSongs: [
                "Fever Pitch",
                "Moody Orange",
                "Devil Like Me",
                "Cocaine Jesus"
            ]
        },
        {
            id: "qpoamxiuhq39",
            name: "The Sheepdogs",
            minutesListened: 400,
            topSongs: [
                "Please Don't Lead Me On",
                "I Don't Know",
                "Feeling Good",
                "Laid Back"
            ]
        },
    ]

    res.status(200).json({
        message: "Walker's Top Artists fetched",
        artists: artists
    });
});

app.use((req, res, next) => {
    console.log('Second middleware executed...');
    res.send('End');
});

module.exports = app;