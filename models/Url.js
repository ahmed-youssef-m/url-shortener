const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    date: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 }
}, { versionKey: false });

const urlModel = mongoose.model('Urls', urlSchema);

module.exports = { urlModel };