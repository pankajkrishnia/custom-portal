const express = require('express');
const app = express();
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('../_middleware/authorize');
const recordServices = require('./record.service');
const db = require('../_helpers/db');
const excel = require("exceljs");

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

// routes
router.post('/create-record', authorize(), createSchema, create);
router.get("/export", exportToExcel);
router.get('/', authorize(), getAll);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    recordServices.create(req.body)
        .then(() => res.json({ message: 'Reocord Created Successfully' }))
        .catch(next);
}

function getAll(req, res, next) {
    recordServices.getAll()
        .then(records => res.json(records))
        .catch(next);
}

function getById(req, res, next) {
    recordServices.getById(req.params.id)
        .then(record => res.json(record))
        .catch(next);
}

function updateSchema(req, res, next) {

    const schema = Joi.object({
        name: Joi.string().empty(''),
        address: Joi.string().empty(''),
        city: Joi.string().empty(''),
        state: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    recordServices.update(req.params.id, req.body)
        .then(record => res.json(record))
        .catch(next);
}

function _delete(req, res, next) {
    recordServices.delete(req.params.id)
        .then(() => res.json({ message: 'Record deleted sucessfully' }))
        .catch(next);
}

function exportToExcel(req, res, next) {
    recordServices.getAll()
        .then(records => {
            let Records = [];

            records.forEach((records) => {
                Records.push({
                    id: records.id,
                    name: records.name,
                    address: records.address,
                    city: records.city,
                    state: records.state
                });
            });

            let workbook = new excel.Workbook();
            let worksheet = workbook.addWorksheet("Records");

            worksheet.columns = [
                { header: "Id", key: "id", width: 5 },
                { header: "Name", key: "name", width: 25 },
                { header: "Address", key: "address", width: 25 },
                { header: "City", key: "city", width: 25 },
                { header: "State", key: "state", width: 25 },
            ];

            // Add Array Rows
            worksheet.addRows(Records);

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=" + "Records.xlsx"
            );

            return workbook.xlsx.write(res).then(function() {
                res.status(200).end();
            });
        })
        .catch(next);
}