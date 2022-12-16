// import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteGroup } from '../../store/groups';
import './DeleteGroupModal.css'

function DeleteGroupModal({currentGroupId}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const { closeModal } = useModal();

    // add error handling here

    const handleDelete = async (e) => {
        e.preventDefault();

        const deleteGroup = await dispatch(thunkDeleteGroup(currentGroupId))

        if(deleteGroup.ok) {
            closeModal()
            history.push('/home')
        } else {
            console.log(deleteGroup)
            return
        }
    }

    return (
        <div className="delete-modal">
            <h2>Are you sure you want to delete this group?</h2>
            <h4>This will also delete all associated Events and Photos.</h4>
            <button onClick={handleDelete}>Yes, Delete it.</button>
            <button onClick={closeModal}>No, Dont!</button>
        </div>
    )

}

export default DeleteGroupModal;