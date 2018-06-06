var http = require('http');
var path = require('path');
var util = require('util');
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = log4js.getLogger('normal');
var dgram = require('dgram');
var serverSocket = dgram.createSocket('udp4');
var host = 'localhost';
var port = '4002';
var udpport = '8061';



//接收前端下发命令请求
var server = http.createServer(app).listen(port, function () { });
app.use(bodyParser.urlencoded({ extended: false }));
server.timeout = 240000;
logger.info('Server running at' + host + ':' + port);

//修改频率接口
app.get('/pic.jpg', function (req, res) {
	res.writeHead(200, { 'Content-Type': 'multipart/form-data' });
	res.end(fs.readFileSync(__dirname + "/pic.jpg"));
});

var count;
//接收数据操作
serverSocket.on('message', function (msg, rinfo) {
	console.log('----------------------recive msg----------------------');
	logger.info('recvData %s(%d bytes) from client %s:%d', msg, msg.length, rinfo.address, rinfo.port);
	var count;
	let msgString = new Buffer(msg.toString(), 'utf8').toString('hex');
	if (msgString.slice(0, 4) === 'FFD8') {
		count = 1;
		fs.writeFileSync(__dirname + '/pic.txt', msgString);
		logger.info('图片缓存文件写入成功! ID: ' + count);
		if (msgString.slice(-4) === 'FFD9') {
			//生成图片
			var dataString = fs.readFileSync(__dirname + '/pic.txt', 'utf-8');
			dataString = dataString.replace(/\ +/g, "");
			var imgData = new Buffer(dataString, 'hex');
			fs.writeFileSync(__dirname + '/pic.jpg', imgData);
		}
		// fs.writeFileSync(__dirname + '/pic.txt', msgString, function (err) {
		// 	if (err) { logger.error('图片缓存文件写入失败! ID: ' + count + ' err: ' + err) }
		// 	else {
		// 		logger.info('图片缓存文件写入成功! ID: ' + count);
		// 		if (msgString.slice(-4) === 'FFD9') {
		// 			//生成图片
		// 			fs.readFileSync(__dirname + '/pic.txt', function (err, data) {
		// 				if (err) {
		// 					logger.error('图片缓存文件读取失败！err: ' + err);
		// 					return
		// 				} else {
		// 					var dataString = data.toString();
		// 					dataString = dataString.replace(/\ +/g, "");
		// 					var imgData = new Buffer(dataString, 'hex');
		// 					fs.writeFileSync(__dirname + '/pic.jpg', imgData, function (err) {
		// 						if (err) { logger.error('图片生成失败' + err) }
		// 						else { logger.info('图片生成成功') }
		// 					});
		// 				}
		// 			});
		// 		}
		// 	}
		// });
	} else {
		count++;
		fs.appendFileSync(__dirname + '/pic.txt', msgString);
		logger.info('图片缓存文件写入成功! ID: ' + count);
		if (msgString.slice(-4) === 'FFD9') {
			//生成图片
			var dataString = fs.readFileSync(__dirname + '/pic.txt', 'utf-8');
			dataString = dataString.replace(/\ +/g, "");
			var imgData = new Buffer(dataString, 'hex');
			fs.writeFileSync(__dirname + '/pic.jpg', imgData);
			logger.info('图片生成成功');
		}
		// fs.appendFileSync(__dirname + '/pic.txt', msgString, function (err) {
		// 	count++;
		// 	if (err) { logger.error('图片缓存文件写入失败! ID: ' + count + ' err: ' + err); }
		// 	else {
		// 		logger.info('图片缓存文件写入成功! ID: ' + count);
		// 		if (msgString.slice(-4) === 'FFD9') {
		// 			//生成图片
		// 			fs.readFileSync(__dirname + '/pic.txt', function (err, data) {
		// 				if (err) {
		// 					logger.error('图片缓存文件读取失败！err: ' + err);
		// 					return
		// 				} else {
		// 					var dataString = data.toString();
		// 					dataString = dataString.replace(/\ +/g, "");
		// 					var imgData = new Buffer(dataString, 'hex');
		// 					fs.writeFileSync(__dirname + '/pic.jpg', imgData, function (err) {
		// 						if (err) { logger.error('图片生成失败' + err) }
		// 						else { logger.info('图片生成成功') }
		// 					});
		// 				}
		// 			});
		// 		}
		// 	}
		// });
	}
});

serverSocket.on('error', function (err) {
	logger.error('error, msg - %s, stack - %s\n', err.message, err.stack);
});

serverSocket.on('listening', function () {
	logger.info("echo server is listening on port " + udpport + '.');
})

serverSocket.bind(udpport);


//日志配置
log4js.configure({
	appenders: [
		{ type: 'console' },
		{ type: 'file', filename: 'img.log', category: 'normal' }
	]
});
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }));