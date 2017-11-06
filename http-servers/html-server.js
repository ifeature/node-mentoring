'use strict';

const http = require('http');
const fs = require('fs');
const through = require('through2');

const hostname = '127.0.0.1';
const port = 3001;

const message = 'Hello World\n';

function write(buffer, encoding, next) {
    this.push(buffer.toString().replace(/\{message\}/, message));
    next();
}

function end(done) {
    done();
}

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.createReadStream('./index.html')
        .pipe(through(write, end))
        .pipe(res)
      .on('error', () => {
        res.statusCode = 500;
        res.end('Internal server error');
      });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});