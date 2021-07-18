const config = require('../config.json');
const jwt = require('jsonwebtoken');
const db = require('../_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.Record.findAll();
}

async function getById(id) {
    return await getRecord(id);
}

async function create(params) {
    await db.Record.create(params);
}

async function update(id, params) {
    const record = await getRecord(id);

    // copy params to record and save
    Object.assign(record, params);
    await record.save();
    return omitHash(record.get());
}

async function _delete(id) {
    const record = await getRecord(id);
    await record.destroy();
}

async function getRecord(id) {
    const record = await db.Record.findByPk(id);
    if (!record) throw 'Record not found';
    return record;
}

function omitHash(record) {
    const { hash, ...recordWithoutHash } = record;
    return recordWithoutHash;
}