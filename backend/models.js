/**
 * models.js
 * 
 * Walker Hildebrand
 * 2019-09-21
 * 
**/

import { model } from 'mongoose';

import { PlaylistPairSchema } from './schemas/playlist_pair';
import { SessionSchema } from './schemas/session';
import { UserSchema } from './schemas/user';

export const PlaylistPair = model('PlaylistPair', PlaylistPairSchema);
export const Session = model('Session', SessionSchema);
export const User = model('User', UserSchema);

