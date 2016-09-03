module.exports = function (server, db) {
    var validateRequest = require("../auth/validateRequest");
 
    server.get("/api/v1/premoApp/data/list", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.premoAppList.find({
                
            },function (err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });
    
    server.get("/api/v1/premoApp/data/topicList", function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.premoAppList.find({
                category : req.params.category
            },function (err, list) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(list));
            });
        });
        return next();
    });

    server.post('/api/v1/premoApp/data/item', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            var item = req.params;
            db.premoAppList.save(item,
                function (err, data) {
                    res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    res.end(JSON.stringify(data));
                });
        });
        return next();
    });
 
    server.get('/api/v1/premoApp/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.premoAppList.find({
                _id: db.ObjectId(req.params.id)
            }, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
            });
        });
        return next();
    });
}