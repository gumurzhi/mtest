var log4js = require('log4js');
var logger = log4js.getLogger('start');
var dbService = require('./dbService').dbService;
var testRec = require('./testrec');
var dbTestRec = new dbService(testRec);

function bz() {
    var rec = {
        name: 'first',
        rec: Math.random()
    };
    // dbTestRec.findOne({name: 'first'})
    //     .then(function (data) {
    //         if (data) {
    //             return dbTestRec.findAndUpdate({_id: data._id}, {rec: Math.random()})
    //         } else {
    //             return dbTestRec.createNew(rec);
    //         }
    //     })
    //     .then(function (answer) {
    //         logger.info(answer);
    //         setTimeout(function () {
    //             bz();
    //         }, 100);
    //     })
    //     .catch(function (err) {
    //         logger.error(err);
    //     });
    dbTestRec.find({})
    .then(function(data){
       if (data.length && data.length > 30){
           logger.trace(Math.floor(Math.random() * data.length));
           var daletedObj = data[Math.floor(Math.random() * data.length)];
           return dbTestRec.remove({_id: daletedObj._id});
       } else {
           return dbTestRec.createNew(rec);
       }

    })
        .then(function (answer) {
            logger.info(answer);
            bz();
        })
    .catch(function(err){
        logger.error(err);
        bz();
    });
}
bz();



