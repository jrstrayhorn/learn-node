//console.log("HELLO WORLD")

//console.log(process.argv)

/*
// Summ numbers in array
var sum = 0;

for(var i=2; i<process.argv.length; i++) {
    sum = sum + Number(process.argv[i]);
}

console.log(sum);
*/

/*
// count number of newlines in file
var fs = require('fs')

var bufferObj = fs.readFileSync(process.argv[2])

var fileString = bufferObj.toString();

var strArr = fileString.split('\n');

console.log(strArr.length-1)
*/

/*
// count number of newlines in file async (ie w/ callback)
var fs = require('fs')

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data.split('\n').length-1)
})
*/

/*
// list files in a given directory, filtered by extension
var fs = require('fs')
var path = require('path')
var findExt = process.argv[3]

fs.readdir(process.argv[2], function (err, list) {
    if (err) throw err;
    list.forEach(function(value) {
        if (path.extname(value) === '.' + findExt) {
            console.log(value);
        }
    })
})
*/

/*
// list files in a given directory, filtered by extension
// using module

var readfilter = require('./readfilter')

var dirName = process.argv[2]
var fileExtToFind = process.argv[3]

readfilter(dirName, fileExtToFind, function (err, filterList) {
    if (err) console.log(err)
    filterList.forEach(function(value) {
        console.log(value)
    })
})
*/

/*
// http get request
var http = require('http')

http.get(process.argv[2], function(res) {
    res.setEncoding('utf8')
    res.on('data', (chunk) => console.log(chunk))
    res.on('error', console.error)
}).on('error', console.error)
*/

/*
// http get request into single stream
var http = require('http')
var concatStream = require('concat-stream')

http.get(process.argv[2], function(res) {
    res.pipe(concatStream(function (data) {
        var dataString = data.toString()
        console.log(dataString.split('').length)
        console.log(dataString)
        })
    )
})*/

// juggling async
// http get from multiple urls

/*
var http = require('http')
var concatStream = require('concat-stream')

// Original work - this works
var count = 3,
    results = {};

for(var i=2; i<5; i++) {
    http.get(process.argv[i], function(res) {
        res.pipe(concatStream(function (data) {
            //console.log(count.toString())
            results[count.toString()] = data.toString()
            count--;
            if (count <= 0) {
                // do something here everything is done
                console.log(results['3'])
                console.log(results['2'])
                console.log(results['1'])
            }
            //console.log(data.toString())
        }))
    })
}


// Alternate way
var results = []
var count = 0

function printResults() {
    for (var i = 0; i < 3; i++) {
        console.log(results[i])
    }
}

function httpGet(index) {
    http.get(process.argv[2 + index], function (res) {
        res.pipe(concatStream(function (err, data) {
            if (err) {
                return console.error(err)
            }

            results[index] = data.toString()
            count++

            if (count === 3) {
                printResults()
            }
        }))
    })
}

for (var i = 0; i < 3; i++) {
    httpGet(i)
}
*/

/*
// Creating a tcp server at port and returning the time
var net = require('net')
var strftime = require('strftime')

var server = net.createServer(function (socket) {
    // socket handling logic
    
    socket.write(strftime('%Y-%m-%d %H:%M\n', new Date()))
    socket.end()
})
server.listen(process.argv[2])
*/

// Hello World HTTP Server
var port = 14444

var http = require('http')
var server = http.createServer(function (req, res) {
    res.end("HELLO WORLD!!")
})
server.listen(port)
console.log(`running on port ${port}....`)

/*
// Creating an HTTP server to serve a file
var port = process.argv[2]
var filePath = process.argv[3]

var http = require('http')
var fs = require('fs')

var server = http.createServer(function (req, res) {
    // request handling logic...
    fs.createReadStream(filePath).pipe(res)
})
server.listen(port)
*/

/*
// create HTTP server that only receives POST requests
// converts incoming POST characters to upper-case and
// returns to client
var port = process.argv[2]

var http = require('http')
var map = require('through2-map')

var server = http.createServer(function (req, res) {
    // request handling logic...
    //console.log(req.method)
    
    if (req.method === "POST") {
        //req.pipe(res)
        req.pipe(map(function (chunk) {
            return chunk.toString().toUpperCase()
        })).pipe(res)
        
    }
    //res.write("HELLO WORLD")
    
})
server.listen(port)
*/

/*
// HTTP server - w/ "routing" and parsing of query string
var port = process.argv[2]

var http = require('http')
var url = require('url')

var server = http.createServer(function (req, res) {
    var urlParseObj = (url.parse(req.url, true))
    var results = {}

    switch (urlParseObj.pathname) {
        case '/api/parsetime':
            res.writeHead(200, { 'Content-Type': 'application/json'})
            var reqDate = new Date(urlParseObj.query.iso)
            results['hour'] = reqDate.getHours()
            results['minute'] = reqDate.getMinutes()
            results['second'] = reqDate.getSeconds()
            res.write(JSON.stringify(results))
            break;

        case '/api/unixtime':
            res.writeHead(200, { 'Content-Type': 'application/json'})
            results['unixtime'] = new Date(urlParseObj.query.iso).getTime()
            res.write(JSON.stringify(results))
            break;

        default:
            res.write("Please use another URL")
            break;
    }
    res.end()
})
server.listen(port)
*/

/*
// Another way to do this one
var http = require('http')
var url = require('url')

function parsetime(time) {
    return {
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds()
    }
}

function unixtime(time) {
    return { unixtime: time.getTime() }
}

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true)
    var time = new Date(parsedUrl.query.iso)
    var results
    
    if (/^\/api\/parsetime/.test(req.url)) {
        result = parsetime(time)
    } else if (/^\/api\/unixtime/.test(req.url)) {
        result = unixtime(time)
    }

    if (result) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
    } else {
        res.writeHead(404)
        res.end()
    }
})
server.listen(Number(process.argv[2]))
*/
