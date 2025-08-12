import React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function ModalDeleteRole(props) {
    return (

        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm delete user</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, are you sure to delete user: {props.roleToDelete.url}?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={props.ConfirmDelete}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteRole;