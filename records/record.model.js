const { DataTypes } = require('sequelize');

module.exports = recordmodel;

function recordmodel(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: false },
        state: { type: DataTypes.STRING, allowNull: false }
    };

    return sequelize.define('Record', attributes);
}