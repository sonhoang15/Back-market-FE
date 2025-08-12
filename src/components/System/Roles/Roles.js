import React from 'react';
import { useState, useRef } from 'react';
import './Roles.scss'
import _, { result, set, values } from 'lodash';
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify';
import { createRoles } from '../../Services/roleService'
import TableRoles from './TableRoles'

function Roles(props) {
    const dataChildDefault = { url: "", description: "", isValidUrl: true }

    const childRef = useRef();

    const [listChilds, setListChilds] = useState({
        child: dataChildDefault
    })


    const handleOnchangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds)
        _listChilds[key][name] = value

        if (value && name === 'url') {
            _listChilds[key]['isValidUrl'] = true
        }
        setListChilds(_listChilds)
    }


    const handleAddNewInput = () => {
        let _listChilds = _.cloneDeep(listChilds)
        _listChilds[`child ${uuidv4()}`] = dataChildDefault
        setListChilds(_listChilds)
    }


    const handleDeleteInput = (key) => {
        let _listChilds = _.cloneDeep(listChilds)
        delete _listChilds[key]
        setListChilds(_listChilds)
    }

    const buidDataToPersist = () => {
        let _listChilds = _.cloneDeep(listChilds)
        let result = []
        Object.entries(listChilds).map(([key, child], index) => {
            result.push({
                url: child.url,
                description: child.description
            })
        })
        return result
    }

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url
        })
        if (!invalidObj) {
            let data = buidDataToPersist()
            let res = await createRoles(data)
            if (res && res.EC === 0) {
                toast.success(res.EM)
                childRef.current.fecthListRole()
                setListChilds({
                    child: dataChildDefault
                });
            }
        } else {
            toast.error("Input URL empty")
            let _listChilds = _.cloneDeep(listChilds)
            const key = invalidObj[0]
            _listChilds[key]['isValidUrl'] = false
            setListChilds(_listChilds)
        }
    }
    return (
        <div className='role-container'>
            <div className='container'>
                <div className=' mt-3'>
                    <div className='title-role'> <h4>new roles</h4></div>
                    <div className=' role-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return (
                                    <>
                                        <div className='row role-child' key={`child-${key}`}>
                                            <div className='col-5 form-group'>
                                                <label>URL:</label>
                                                <input
                                                    type='text'
                                                    className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                    value={child.url}
                                                    onChange={(event) => handleOnchangeInput('url', event.target.value, key)} />
                                            </div>
                                            <div className='col-5 form-group'>
                                                <label>Description:</label>
                                                <input type='text'
                                                    className='form-control'
                                                    value={child.description}
                                                    onChange={(event) => handleOnchangeInput('description', event.target.value, key)}
                                                />
                                            </div>
                                            <div className='col-2 mt-4 actions'>
                                                <i className="fa fa-plus add" onClick={() => handleAddNewInput()} ></i>
                                                {index >= 1 && <i className="fa fa-trash delete " onClick={() => handleDeleteInput(key)}></i>}
                                            </div>
                                        </div>
                                    </>
                                )
                            })
                        }
                        <div>
                            <button className='btn btn-warning mt-3' onClick={() => handleSave()}>save</button>
                        </div>

                    </div>
                </div>
                <hr />
                <div className=' mt-3'>
                    <h4>list role</h4>
                    <TableRoles ref={childRef} />
                </div>

            </div>
        </div>
    );
}

export default Roles;