/**
 * app.js
 * 
 * Walker Hildebrand
 * 2019-09-13
 * 
 */

///////// Imports /////////////////////////////////////////
const mongoose = require('mongoose');


///////// Models //////////////////////////////////////////
import { PlaylistPair, Session, User } from './models';


///////// Database ////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
    {
        console.log('Database connection successful');
    })
    .catch(err => {
        console.log('Database connection failed');
        console.log(err);
    });


///////// Spotify ////////////////////////////////////////
const saveSession = function(session)
{
    new Promise()
    return new Promise((resolve, reject) => {
        Session
            .deleteMany({ sessionID: session.sessionID })
            .then(() =>
            {
                console.log('Saved ' + JSON.stringify(session));
                session.save((other, err) =>
                {
                    if (err)
                    {
                        console.log(err);
                        reject(err);
                    }
                    else
                    {
                        resolve(other);
                    }
                });
            })
            .catch(err =>
            {
                console.log(err)
                reject(err);
            });
    });
}

const getUserFromSession = function(session)
{
    return new Promise((resolve, reject) =>
    {
        Session
            .findOne({ sessionID: session.sessionID })
    })
}


///////// Debug ///////////////////////////////////////////
const printSessions = function()
{
    Session.find({}, (err, docs) =>
    {
        if (err) console.log(err);
        console.log(docs);
    });
}