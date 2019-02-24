/**
 * app.js
 * 
 * Walker Hildebrand
 * February 2019
 * www.walkerhildebrand.com
 */

/////////////////////////////////// Imports ///////////////////////////////////
const express           = require('express');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const querystring       = require('querystring');
const request           = require('request');
const expressSession    = require('express-session');
const spotify           = require('./spotify');

//////////////////////////////////// Models ////////////////////////////////////
const Artist            = require('./models/artist');
const Session           = require('./models/session');
const User              = require('./models/user')

/////////////////////////////////// Settings ///////////////////////////////////
const DEBUG = true;

/////////////////////////////////// Database ///////////////////////////////////
mongoose.connect('mongodb+srv://walker:uhVohgU5zD8d1F6H@cluster0-svu8u.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
    .then(() =>
    {
        console.log('Database connection successful...');
    })
    .catch(err =>
    {
        console.log(err);
    });

////////////////////////////////// Database //////////////////////////////////
const app = express();
app .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(expressSession({
        secret: 'inigo montoya',
        resave: false,
        saveUninitialized: true
    }))
    .use((req, res, next) =>
    {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
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

//////////////////////////////////// Debug ////////////////////////////////////
app.all('*', function (req, res, next)
{
    if (DEBUG)
    {
        console.log("--- DEBUG INFO ---------------");
        console.log(req.method + " " + req.url);
        console.log("sessionID: " + req.sessionID);
        console.log(req.session);
        console.log("------------------------------");
    }
    next(); // pass control to the next handler
});

/////////////////////////////// Helper Functions ///////////////////////////////
const addOrUpdateSession = function(session)
{
    return new Promise(() =>
    {
        Session
            //.deleteMany({ sessionID : session.sessionID })
            .deleteMany({}) // for now
            .then(() =>
            {
                session.save();
                Promise.resolve();
            });
    });
}

const getSession = function(request)
{
    return new Promise((resolve, reject) =>
    {
        Session
            .find( {sessionID : request.sessionID} )
            .then(sessions =>
            {
                if (sessions && sessions.length == 1) resolve(sessions[0]);
                else
                {
                    console.log("Found sessions:")
                    console.log(sessions);
                }
            })
    });
}

const getAuthToken = function(request)
{
    return new Promise((resolve, reject) =>
    {
        getSession(request)
            .then(session =>
            {
                resolve(session.authToken);
            })
            .catch(err =>
            {
                console.log(err);
            });
    });
}

const getRefreshToken = function(request)
{
    return new Promise((resolve, reject) =>
    {
        getSession(request)
            .then(session =>
            {
                return session.refreshToken;
            });
    });
}

//////////////////////////// Spotify Authorization ////////////////////////////
app.get('/spotify/login', (req, res, next) =>
{
    res.redirect(spotify.authorizeLink +
        querystring.stringify({
            response_type: 'code',
            client_id: spotify.clientID,
            scope: spotify.scope,
            redirect_uri: spotify.redirectURI,
            state: req.sessionID
        })
    );
});

app.get('/spotify/logout', (req, res, next) =>
{
    res.redirect(spotify.authorizeLink +
        querystring.stringify({
            response_type: 'code',
            client_id: spotify.clientID,
            scope: spotify.scope,
            redirect_uri: spotify.redirectURI,
            state: req.sessionID,
            show_dialog: true
        })
    );
});

app.get('/spotify/callback', function (req, res, next)
{
    const code = req.query.code;
    const state = req.query.state;
    
    if (state == null || state != req.sessionID)
    {
        console.log("--- Mismatched State Error ----------");
        console.log(`State:        ${state}`);
        console.log(`Stored State: ${req.sessionID}`)
        console.log("-------------------------------------");

        res.redirect('/error');
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
              'Authorization': 'Basic ' + Buffer.from(spotify.clientID + ':' + spotify.clientSecret).toString('base64')
            },
            json: true
        };

        request.post(authOptions, function(err, res, body)
        {
            if (!err && res.statusCode === 200)
            {
                const session = new Session({
                    sessionID: req.sessionID,
                    authToken: body.access_token,
                    refreshToken: body.refresh_token
                });
        
                addOrUpdateSession(session);
            }
            else
            {
                console.log(`POST request error - status code ${res.statusCode}`);
                console.log(err);
            }
        });

        res.redirect('http://localhost:4200/spotify');
    }
});

///////////////////////////////// Spotify API /////////////////////////////////
app.get('/spotify/user', (req, res, next) =>
{
    getAuthToken(req)
        .then(authToken =>
        {
            return spotify.getUser(authToken);
        })
        .then(user =>
        {
            console.log(user);
            res.status(200).json({
                message: 'User fetched sucessfully',
                user: user
            });
        });
});

app.get('/spotify/tracks', (req, res, next) =>
{
    getAuthToken(req)
        .then(authToken =>
        {
            console.log("Successfully fetched authentication token: " + authToken);
            return spotify.getTracks(authToken);
        })
        .then(tracksData =>
        {
            //console.log(tracksData);
            res.end();
        })
        .catch(err =>
        {
            console.log(err);
            res.end();
        });
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

/////////////////////////////////// Exports ///////////////////////////////////
module.exports = app;