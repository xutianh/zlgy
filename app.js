var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

app.listen(3000);

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}

var num = 0;

io.on('connection', function (socket) {
    num++;

    io.emit('enter', num);

    socket.on('alpha', function(str){
        io.emit('alpha', str);
    });
    socket.on('beta', function(str){
        io.emit('beta', str);
    });
    socket.on('gamma', function(str){
        io.emit('gamma', str);
    });

    socket.on('disconnect', function(){
        io.emit('alpha', socket.nickname + ' left ');
    });
});

console.log('启动成功');