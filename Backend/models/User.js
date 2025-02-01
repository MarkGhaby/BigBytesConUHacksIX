const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    spotifyId: { type: String, required: true, unique: true },
    displayName: String,
    email: { type: String, unique: true, sparse: true },
    profileImage: String,
    accessToken: String
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);