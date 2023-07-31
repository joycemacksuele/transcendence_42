import React, { useState } from 'react';
import axios from 'axios';

import '../../css/Chat.css'
import avatarImage from '../../images/avatar_default.png'

// Importing bootstrap and other modules
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const Chat = () => {

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
        // <div className="maincontainer">
            <div class="container py-3 px-0">
                <div class="row overflow-hidden">

                    {/* Left side with recent messages */}
                    <div class="col-3 px-0">
                        <div>
                            <div class="bg-gray px-4 py-2 bg-light rounded">
                                <p class="h5 mb-0 py-1">Recent messages</p>
                            </div>

                            <div class="messages-box rounded">
                                <div class="list-group rounded">

                                    {/* EXAMPLE OF LIST -> NEEDS TO TURN INTO A COMPONENT */}
                                    <a class="list-group-item list-group-item-action active text-white rounded-0">
                                        <div class="media"><img src={avatarImage} alt="user" width="50" class="rounded-circle" />
                                            <div class="media-body ml-4">
                                                <div class="d-flex align-items-center justify-content-between mb-1">
                                                    <h6 class="mb-0">Jassa</h6>
                                                    {/*<small class="small font-weight-bold">25 Dec</small>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="#" class="list-group-item list-group-item-action list-group-item-light rounded-0">
                                        <div class="media"><img src={avatarImage} alt="user" width="50" class="rounded-circle" />
                                            <div class="media-body ml-4">
                                                <div class="d-flex align-items-center justify-content-between mb-1">
                                                    <h6 class="mb-0">Jassa</h6>
                                                    {/*<small class="small font-weight-bold">14 Dec</small>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side with message box */}
                    <div class="col-7 px-7">

                        {/* Right side only the messages */}
                        <div class="px-4 py-3 chat-box">

                            <div class="media w-50">
                                <img src={avatarImage} alt="user" width="50" class="rounded-circle" />
                                <div class="media-body py-2">
                                    <div class="bg-light rounded py-2 px-3 mb-2">
                                        <p class="text-small mb-0 text-muted">Test which is a new approach all solutions</p>
                                    </div>
                                    <p class="small text-muted">12:00 PM | Aug 13</p>
                                </div>
                            </div>

                            <div class="media w-50 ml-auto mb-3">
                                <div class="media-body">
                                    <div class="bg-primary rounded py-2 px-3 mb-2">
                                        <p class="text-small mb-0 text-white">Test which is a new approach to have all solutions</p>
                                    </div>
                                    <p class="small text-muted">12:00 PM | Aug 13</p>
                                </div>
                            </div>

                            <div class="media w-50 ml-auto mb-3">
                                <div class="media-body">
                                    <div class="bg-primary rounded py-2 px-3 mb-2">
                                        <p class="text-small mb-0 text-white">Apollo University, Delhi, India Test</p>
                                    </div>
                                    <p class="small text-muted">12:00 PM | Aug 13</p>
                                </div>
                            </div>
                        </div>

                        {/* Right side only the bottom message form */}
                        <form action="#" class="bg-light rounded">
                            <div class="input-group align-items-center">
                                <input type="text" placeholder="Type a message" aria-describedby="button-addon2" class="form-control rounded border-0 py-3 bg-light" />
                                <div class="input-group-append">
                                    <button id="button-addon2" type="button" class="btn btn-link"> <i class="fa fa-paper-plane"></i></button>
                                </div>
                            </div>
                        </form>

                    </div>

                </div>
             </div>
        // </div>


    )
}

export default Chat