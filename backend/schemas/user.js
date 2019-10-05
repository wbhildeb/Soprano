/**
 * user.js
 * 
 * Walker Hildebrand
 * 2019-09-21
 * 
 */

import { Schema } from 'mongoose';
import { PlaylistPairSchema } from './playlist_pair';

export const UserSchema = new Schema({
    userID:         { type: String, required: true },
    authToken:      { type: String, required: true },
    refreshToken:   { type: String, required: true },
    playlistPairs:  { type: [PlaylistPairSchema], required: true }
});