
var mongoose = require('mongoose');
var log4js = require('log4js');
var logger = log4js.getLogger('lib/mongoose');
var Q = require('q');
var config = require('./config');

var mongoUri =  config.mongoose.uri || "mongodb://localhost/appiniontest";
logger.trace(mongoUri);
mongoose.connect(mongoUri);

var db = mongoose.connection;
db.on('error', function (err) {
    logger.error("MongoDB connection error", err.message);
    mongoose.disconnect();

});
db.on('disconnected', function() {
    logger.warn('MongoDB disconnected!');
    mongoose.connect();
});


db.once('open', function callback() {
    logger.info("Connected to MongoDB!");
});

// -----------------------------------------------
//var Schema = mongoose.Schema;
/** @alias DbService */
var DbService = function (model) {
    this.model = model;
};

DbService.prototype.disconnect = function () {
  db.close();
};

/**
 *
 * @param conditions
 * @returns {*|{}|Query|Query<T[]>|Query<T>}
 */
DbService.prototype.find = function (conditions, fields) {
   // logger.trace('conditions:', conditions, 'fields:', fields);
    return this.model.find(conditions, fields, this._checkIfError);
};

DbService.prototype.findWithLimit = function (conditions, fields, limit) {
    return this.model.find(conditions, fields).limit(limit).exec(this._checkIfError);
};

/**
 *
 * @param {Object} conditions
 * @param {Object} fields
 * @param {Object} sort
 * @param {Number} limit
 * @param {Number} skip
 * @returns {Promise|Promise<T>|Array|{index: number, input: string}}
 */
DbService.prototype.fullCycleSearch = function (conditions, fields, sort, limit, skip) {
    return this.model.find(conditions, fields).sort(sort).skip(skip).limit(limit).exec(this._checkIfError);
};

/**
 * 
 * @param {Object} aggregateField
 */
DbService.prototype.aggregate = function (aggregateField) {
  return this.model.aggregate(aggregateField, this._checkIfError);
};

/**
 *
 * @param conditions
 * @returns {Promise<T>}
 */
DbService.prototype.remove = function (conditions) {
    var deferred = Q.defer();
    this.model.remove(conditions, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data.result);
        }
    });
    return deferred.promise;
};

/**
 *
 * @param id
 * @returns {Query<T>|Query}
 */
DbService.prototype.findById = function (id) {
    var my = this;
    return this.model.findById(id, my._checkIfError);
};

/**
 *
 * @param id
 * @param newData
 * @returns {Query<T>|Query|*}
 */
DbService.prototype.findByIdAndUpdate = function (id, newData) {
    return this.model.findOneAndUpdate({_id: id}, newData, {returnNewDocument: true}, this._checkIfError);
};

/**
 *
 * @param {Object} conditions
 * @param {Object} fields
 * @returns {Query<T>|*|Query}
 */
DbService.prototype.findOne = function (conditions, fields) {
    return this.model.findOne(conditions, fields, this._checkIfError);
};


/**
 *
 * @param obj
 * @returns {*}
 */
DbService.prototype.createNew = function (obj) {
    //var newModel = new this.model;
    return this.model.create(obj, this._checkIfError);

    // function makeNewObj(obj) {
    //     for (var k in obj) {
    //         newModel[k] = obj[k];
    //     }
    //     return newModel;
    // }
};
/**
 *
 * @param conditions
 * @param newData
 */
DbService.prototype.findAndUpdate = function (conditions, newData, options) {
    logger.debug('findAndUpdate got new data:', newData);
    var deferred = Q.defer();
    this.model.findOneAndUpdate(conditions, newData, options, function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(data);
        }
    });
    return deferred.promise;
};

/**
 *
 * @param conditions
 */
DbService.prototype.count = function (conditions) {
   return this.model.count(conditions, this._checkIfError);
};
/**
 *
 * @param {Object} conditions
 */
DbService.prototype.findOneAndDelete = function (conditions) {
    return this.model.remove(conditions, this._checkIfError);
};
/**
 *
 * @param err
 * @param data
 * @returns {Promise<T>}
 * @private
 */
DbService.prototype._checkIfError = function (err, data) {
    var deferred = Q.defer();
    if (err) {
        deferred.reject(err);
    } else {
        deferred.resolve(data);
    }
    return deferred.promise;
};


module.exports.dbService = DbService;
module.exports.mongoose = mongoose;
module.exports.connection = mongoose.connection;
