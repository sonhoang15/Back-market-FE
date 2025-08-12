import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { fetchAllRole, updateUser } from '../../Services/roleService';
import { toast } from 'react-toastify';
import _ from 'lodash';

function ModalEditRole(props) {
    const { action, dataModalRole } = props;

    const defaultUserdata = {
        url: '',
        description: '',
    }
    const validInputsDefault = {
        url: true,
        description: true,
    }
    const [roleData, setRoleData] = useState(defaultUserdata);
    const [validInputs, setValidInput] = useState(validInputsDefault)

    useEffect(() => {
        setRoleData({ ...dataModalRole })
    }, [dataModalRole]);
    const handleChange = (value, name) => {
        let _roleData = _.cloneDeep(roleData);
        _roleData[name] = value;
        setRoleData(_roleData);
    }

    const checkValidInput = () => {
        if (action === 'UPDATE') return true
        setValidInput(validInputsDefault)
        let arr = ['url', 'description']
        let check = true
        for (let i = 0; i < arr.length; i++) {
            if (!roleData[arr[i]]) {

                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInput(_validInputs)
                toast.error(`Empty input ${arr[i]}`)
                check = false;
                break;
            }
        }
        return check;
    }
    const ConfirmRole = async () => {
        let check = checkValidInput()
        if (check === true) {
            let res = await updateUser({ ...roleData });
            if (res && res.EC === 0) {
                toast.success('Update succsed...')
                props.hide();
                setRoleData({ ...defaultUserdata })
            }
            if (res && res.EC !== 0) {
                toast.error(res.EM)
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[res.DT] = false;
                setValidInput(_validInputs)
            }
        }
    }
    const handleCloseModalRole = () => {
        props.hide()
        setRoleData(defaultUserdata)
        setValidInput(validInputsDefault)
    }
    return (
        <>
            <Modal size='lg' show={props.show} className='modal-user' >
                <Modal.Header >
                    <Modal.Title id='contained-modal-title-vcenter'>
                        Edit Role
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal-user-container row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Url</label>
                            <input type='text' className={validInputs.url ? 'form-control' : 'form-control is-invalid'} value={roleData.url}
                                onChange={(e) => handleChange(e.target.value, 'url')}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Description</label>
                            <input type='text' className={validInputs.description ? 'form-control' : 'form-control is-invalid'} value={roleData.description}
                                onChange={(e) => handleChange(e.target.value, 'description')}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalRole()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => ConfirmRole()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal >
        </>
    );
}

export default ModalEditRole;