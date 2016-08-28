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
            db.premoAppLists.find({
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
 
    server.get('/api/v1/premoApp/data/item/:id', function (req, res, next) {
        validateRequest.validate(req, res, db, function () {
            db.premoAppLists.find({
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