module.exports = {
    "mongoose": {
        "uri": "mongodb://repl_0_AppinionReplSet:27017,46.101.164.123:27017,46.101.213.229:27017/appiniontest",
        "options": {
            "maxPoolSize":1000,
            "server": {
                "auto_reconnect":true,
                "poolSize":10,
                "reconnectTries":200000
            },
            "replSet": {
                "socketOptions": {
                    "keepAlive": 1,
                    "connectTimeoutMS" : 30000 ,
                    "socketTimeoutMS": 0
                },
                "connectWithNoPrimary": true,
                "rs_name":"AppinionReplSet",
                "read_secondary": true,
                "slaveOk": true
            }
        }
    }  
};