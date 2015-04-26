module.exports = function(mashmc, route) {
  var db = mashmc.db;

  route
    .get('.json', function(req, res) {
      var filter = req.query.filter && JSON.parse(req.query.filter) || {};
      var defaults = { category: 'media', type: 'video' };
      for (var f in filter)
        defaults[f] = filter[f];
      db.find(defaults)
        .sort({ title: 1 })
        .exec(function(err, docs) {
          res.json(docs);
        })
    })
}