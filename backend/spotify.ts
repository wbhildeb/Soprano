import { User } from './models/user';
import * as request from 'request';
import { stringify } from '@angular/core/src/render3/util';

exports.clientID        = '391e2916ad4a4709908a2d71ffaeb0c5';
exports.clientSecret    = '8bfdab0cdbd841bfb127f58545b90402';
exports.redirectURI     = 'http://localhost:3000/spotify/callback';
exports.scope           = 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private';
exports.stateKey        = 'spotify_auth_state';
exports.sessionKey      = 'spotify_session'
exports.authorizeLink   = 'https://accounts.spotify.com/authorize?';


const auth = "BQD9bEjY3Wbg7eUqjJB0NDYBa_R3CC6POvwK3apsu3BTt9-X4lojYCyrQB2qZUF56143ySil8zdWxMwDP5fCJoMWTWTLuH-slQWAU18XneQvovo6HCDYklvT8d3MubpEmW8QznHwcpxLYa5dRhM8Uq5hM934sqS-JICa7cfqVnfTMYA";

/**
 * This function returns the current user
 * @param {string} auth_token - The authentication token needed by spotify
 */
module.exports.getUser = function(auth_token: string) : Promise<User>
{
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + auth_token },
        json: true
    };

    return new Promise((resolve, reject) =>
    {
        request.get(options, (err, res, body) =>
        {
            if (err || res.statusCode != 200)
            {
                console.log(err);
                reject(err);
            }
            else
            {
                resolve(new User({
                    userID:             body.id,
                    displayName:        body.display_name,
                    imageURL:           (body.images[0]) ? body.images[0].url : null
                }));
            }
        });
    });
}