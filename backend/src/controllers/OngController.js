const crypto = require('crypto');
const connection = require('../database/connection');

async function create(req, res) {

    const { name, email, whatsaap, city, uf } = req.body;
    const id = crypto.randomBytes(4).toString('HEX');

    await connection('ongs').insert({
        id,
        name,
        email,
        whatsaap,
        city,
        uf
    });

    return res.json({ id });
}

async function index(_, res) {

    const ongs = await connection('ongs').select('*');

    return res.json(ongs);
}

module.exports = { create, index };