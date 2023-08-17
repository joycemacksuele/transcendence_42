import React, { useState } from 'react';
import axios from 'axios';

const ChatInputField = () => {

    const myMargin = { margin: '5% 0 5% 0', padding: '3% 0 3% 0', backgroundColor: 'lightgreen', width: '40%'};

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [okMessage, setOkMessage] = useState('');

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() == '') {
            setErrorMessage('Please write a message.');
            setOkMessage('');
            return;
        }
        else {
            try {
                console.log('BEFORE SENDING TO BACKEND');// TODO I never see this log too I THINK FRONTEND IS NOT LOGGING

                const response = await axios.post('http://localhost:3001/chat', { message });
                // console.log(response.data); // Handle the response as needed
                console.log('Response from the backend in JSON: ', JSON.stringify(response));// TODO I never see this log

                setMessage('');
                setErrorMessage('');
            } catch (error) {
                console.error('[FRONTEND ERROR] ', error);
            }
            setOkMessage("Message sent.")
        }
    };

    // Trying socket.io
    // io.on('connection', (socket) => {
    //     console.log('a user connected');
    //     socket.on('chat message', (msg) => {
    //         io.emit('chat message', msg);
    //         console.log('message: ' + msg);
    //     });
    //     socket.on('disconnect', () => {
    //         console.log('user disconnected');
    //     });
    // });

    return (
        // Trying socket.io
        // <script src="/socket.io/socket.io.js"></script>
        //     <script>
        //         var socket = io();
        //         var messages = document.getElementById('messages');
        //         var form = document.getElementById('form');
        //         var input = document.getElementById('input');
        //
        //         form.addEventListener('submit', function(e) {
        //             e.preventDefault();
        //             if (input.value) {
        //                 socket.emit('chat message', input.value);
        //                 input.value = '';
        //             }
        //         });
        //
        //         socket.on('chat message', function(msg) {
        //             var item = document.createElement('li');
        //             item.textContent = msg;
        //             messages.appendChild(item);
        //             window.scrollTo(0, document.body.scrollHeight);
        //         });
        //     </script>

        <div style={myMargin}>
            <b>Enter your name:</b>
            <form onSubmit={handleSend}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                /> &nbsp;

                <button type="submit">Submit</button>
                { !message && <p style={{ color: 'red' }}> { errorMessage } </p> }
                {  message && <p style={{ color: 'orange' }}>You are typing ...</p>}
                { !message && <p style={{ color: 'green' }}> { okMessage } </p> }
            </form>
        </div>
    );
}

export default ChatInputField