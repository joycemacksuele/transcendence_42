import React, { useState } from 'react';
import axios from 'axios';
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// NOT BEING USED NOW -> the Chat.tsx on ../../pages will be moved here later on as a component of the page (not a whole page)
const Chat = () => {

	app.get('/chat', (req, res) => {
		res.sendFile(__dirname + '/index.html');
	});

	io.on('connection', (socket) => {
		console.log('a user connected');
		socket.on('chat message', (msg) => {
			io.emit('chat message', msg);
			console.log('message: ' + msg);
		});
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
	});

	http.listen(port, () => {
		console.log(`Socket.IO server running at http://localhost:${port}/`);
	});

	server.listen(3000, () => {
		console.log('listening on *:3000');
	});

	return (
		<script src="/socket.io/socket.io.js"></script>
			<script>
				var socket = io();
				var messages = document.getElementById('messages');
				var form = document.getElementById('form');
				var input = document.getElementById('input');

				form.addEventListener('submit', function(e) {
					e.preventDefault();
					if (input.value) {
						socket.emit('chat message', input.value);
						input.value = '';
					}
				});

				socket.on('chat message', function(msg) {
					var item = document.createElement('li');
					item.textContent = msg;
					messages.appendChild(item);
					window.scrollTo(0, document.body.scrollHeight);
				});
			</script>
		<div>
			<ul id="messages"></ul>
			<form id="form" action="">
				<input id="input" autoComplete="off"/>
				{/*<button onClick={sendMessage}> Send </button>*/}
				<button> Send </button>
			</form>
		</div>
	);
	
};

export default Chat;
