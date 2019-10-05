/**
 * playlis_pair.js
 * 
 * Walker Hildebrand
 * 2019-09-21
 * 
 */

import { Schema } from 'mongoose';
 
export const PlaylistPairSchema = new Schema({
    subID:      { type: String, required: true },   // id of the sub-playlist
    superID:    { type: String, required: true }    // id of the super-playlist
});