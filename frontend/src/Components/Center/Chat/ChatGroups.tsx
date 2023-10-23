import React, { useState, useEffect } from 'react';
import avatarImage from '../../../images/avatar_default.png'

// Importing bootstrap and other modules
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import NavLink from 'react-bootstrap/NavLink';

// type PropsHeader = {
//     setActiveContentRight: (value: (((prevState: GroupType) => GroupType) | GroupType)) => void;
//     // membersGroupType: GroupType;
// };

const ChatGroups = () => {
// const ChatGroups: React.FC<PropsHeader> = ({ setActiveContentRight }) => {

    ////////////////////////////////////////////////////////////////////// UI OUTPUT
    return (
        <>
            {/* Available groups row */}
            <Row className='h-80'>
                <Card.Body variant="top">
                    <Stack gap={1}>
                        <div className="media" className="p-2">
                            <img src={avatarImage} alt="user" width="20" className="rounded-circle" />
                            Joyce's group
                            {/*<small className="small font-weight-bold">25 Dec</small>*/}
                        </div>
                        <NavLink className="p-2">Jaka's group</NavLink>
                        <div className="p-2">Corina's group</div>
                        <div className="p-2">Ho Kai's group</div>
                        <div className="p-2">Robert's group</div>
                    </Stack>
                </Card.Body>
            </Row>
        </>
    )
}

export default ChatGroups
