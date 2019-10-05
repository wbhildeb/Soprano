/**
 * app.js
 * 
 * Walker Hildebrand
 * 2019-09-21
 * 
 */

import SpotifyWebAPI from 'spotify-web-api-node';

var spotifyAPI = new SpotifyWebAPI({
    clientId: 'fcecfc72172e4cd267473117a17cbd4d',
    clientSecret: 'a6338157c9bb5ac9c71924cb2940e1a7',
    redirectUri: 'http://www.example.com/callback'
});

