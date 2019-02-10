const express       = require('express');
const mongoose      = require('mongoose');
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const querystring   = require('querystring');
const request       = require('request');
const session       = require('express-session');

const spotify       = require('./spotify-credentials');

const Artist        = require('./models/artist');
const Session       = require('./models/session');
const User          = require('./models/user')


const app = express();

mongoose.connect('mongodb+srv://walker:uhVohgU5zD8d1F6H@cluster0-svu8u.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
    .then(() =>
    {
        console.log('Database connection successful...');
    })
    .catch((err) =>
    {
        console.log(err);
    });


app .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(session({
        secret: 'inigo montoya',
        resave: false,
        saveUninitialized: true
    }));

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    )
    next();
});

/////////// SPOTIFY AUTHORIZATION ///////////
app.get('/spotify/login', (req, res, next) =>
{
    var state = spotify.generateState();
    res.cookie(spotify.stateKey, state);

    res.redirect(spotify.authorizeLink +
        querystring.stringify({
            response_type: 'code',
            client_id: spotify.clientID,
            scope: spotify.scope,
            redirect_uri: spotify.redirectURI,
            state: state
        })
    );
});

app.get('/spotify/callback', function (req, res, next)
{
    var code = req.query.code;
    var state = req.query.state;
    var storedState = req.cookies ? req.cookies[spotify.stateKey] : null;
    
    if (state == null || state != storedState)
    {
        res.redirect('/#' +
            querystring.stringify({
                error: state + ',' + storedState
            })
        );
    }
    else
    {
        var authOptions =
        {
            url: 'https://accounts.spotify.com/api/token',
            form: {
              code: code,
              redirect_uri: spotify.redirectURI,
              grant_type: 'authorization_code'
            },
            headers: {
              'Authorization': 'Basic ' + (new Buffer(spotify.clientID + ':' + spotify.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(err, res, body)
        {
            if (!err && res.statusCode === 200)
            {
                const session = new Session({
                    sessionID: sessionID,
                    authToken: body.access_token,
                    refreshToken: body.refresh_token
                });
        
                session.save();
            }
        });

        const sessionID = spotify.generateState();
        res.cookie(spotify.sessionKey, sessionID);
        console.log(req.cookies)
        res.redirect('http://localhost:4200/spotify');
    }
});
/////////// SPOTIFY AUTHORIZATION ///////////

app.get('/spotify/user', (req, res, next) =>
{
    console.log(req.cookies[spotify.sessionKey]);
});


app.post('/api/artists', (req, res, next) =>
{
    const artist = new Artist({
        name: req.body.name,
        minutesListened: req.body.minutesListened
    });
    
    artist.save();

    res.status(201).json({
        message: 'Artist sucessfully saved'
    });
});

app.get('/api/artists', (req, res, next) => {
    Artist.find()
        .then(documents =>
        {
            res.status(200).json({
                message: 'Artists fetched successfully',
                artists: documents
            });
            console.log(documents);
        })
        .catch(err =>
        {
            console.log(err);
        });
});

app.delete('/api/artists/:id', (req, res, next) =>
{
    console.log(req.params.id);
    res.statusCode(200).json({
        message: 'Delete request ignored! ...for now...'
    });
});

module.exports = app;