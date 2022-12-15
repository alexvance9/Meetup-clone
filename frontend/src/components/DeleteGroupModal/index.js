// import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteGroup } from '../../store/groups';

function DeleteGroupModal({currentGroupId}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();

        const deleteGroup = await dispatch(thunkDeleteGroup(currentGroupId))

        if(deleteGroup.ok) {
            closeModal()
            history.push('/home')
        }
    }

    return (
        <div className="delete-modal">
            <h2>Are you sure you want to delete this group?</h2>
            <h3>This will also delete all associated Events and Photos.</h3>
            <button onClick={handleDelete}>Yes, Delete it.</button>
            <button onClick={closeModal}>No, Dont!</button>
        </div>
    )

}

export default DeleteGroupModal;