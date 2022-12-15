// import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

function DeleteGroupModal() {
    const dispatch = useDispatch();
    const history = useHistory();

    const { closeModal } = useModal();

    const handleDelete = (e) => {
        e.preventDefault();

        c
    }

    return (
        <div className="delete-modal">
            <h2>Are you sure you want to delete this group?</h2>
            <h3>This will also delete all associated Events and Photos.</h3>
            <button >Yes, Delete it.</button>
            <button >No, Dont!</button>
        </div>
    )

}

export default DeleteGroupModal;