// TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE
import React, { useState } from 'react';
import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';

const RecentChats = () => {

    ////////////////////////////////////////////////////////////////////// UI OUTPUT

    return (
        <>
            {/* Recent chats row */}
            <Row className='h-100'>
                <Card.Body variant="top">
                    <Stack gap={1}>
                        <div class="media" className="p-2">
                            {/*TODO: EACH USER SHOWN ON THE CHAT SCREEN HAS TO BE CLICKABLE AND BRING THE USER TO THIS USER'S PUBLIC PROFILE PAGE*/}
                            <img src={avatarImage} alt="user" width="20" class="rounded-circle" />
                            Joyce
                            {/*<small class="small font-weight-bold">25 Dec</small>*/}
                        </div>
                        <div className="p-2">Jaka</div>
                        <div className="p-2">Corina</div>
                        <div className="p-2">Hokai</div>
                        <div className="p-2">Robert</div>
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default RecentChats
