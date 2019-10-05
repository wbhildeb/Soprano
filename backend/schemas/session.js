/**
 * session.js
 * 
 * Walker Hildebrand
 * 2019-09-21
 * 
 */

import { Schema, model } from 'mongoose';
 
export const SessionSchema = new Schema({
    sessionID:     { type: String, required: true },
    userID:        { type: String, required: true }
});