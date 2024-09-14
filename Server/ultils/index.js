'use strict';

const { Types } = require('mongoose');

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

module.exports = convertToObjectIdMongoDb