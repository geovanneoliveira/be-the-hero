const connection = require('../database/connection');

async function index(req, res) {

    const { page = 1 } = req.query;
    const [count] = await connection('incidents').count();

    const incidents = await connection('incidents')
        .join('ongs', 'ong_id', '=', 'ongs.id')
        .limit(5)
        .offset((page - 1) * 5)
        .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.city', 'ongs.whatsapp', 'ongs.uf']);

    res.header('X-Total-Count', count['count(*)']);
    return res.json(incidents);

}

async function create(req, res) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    const [id] = await connection('incidents').insert({
        title,
        description,
        value,
        ong_id
    });

    return res.json({ id })
}

async function destroy(req, res) {

    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incidents = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

    if (incidents.ong_id != ong_id) {

        return res.status(401).json({ error: "oporation not permited" });
    }

    await connection('incidents').where('id', id).delete();
    return res.status(204).send();
}

module.exports = { create, index, destroy };