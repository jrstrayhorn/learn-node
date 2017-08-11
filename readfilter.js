// export single function w/ three arguments:
// 1 - the directory name
// 2 - the filename extension string
// 3 - callback function

var fs = require('fs')
var path = require('path')

module.exports = function (dirName, fileExt, callback) {
    fs.readdir(dirName, function (err, list) {
        if (err) return callback(err)
        var filterList = list.filter(function(value) {
            return path.extname(value) === '.' + fileExt;
        })
        callback(null, filterList)
    })
}