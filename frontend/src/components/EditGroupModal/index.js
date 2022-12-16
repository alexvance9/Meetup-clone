import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkEditGroup } from '../../store/groups';


function EditGroupModal({ currentGroup }) {
    const dispatch = useDispatch();
    const history = useHistory();
    // console.log(currentGroup)

    const [name, setName] = useState(currentGroup.name);
    const [about, setAbout] = useState(currentGroup.about);
    const [type, setType] = useState(currentGroup.type);
    const [isPrivate, setIsPrivate] = useState(currentGroup.private);
    const [city, setCity] = useState(currentGroup.city);
    const [state, setState] = useState(currentGroup.state);
    
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        if (name.length > 60) errors.push("Name must be 60 characters or less");
        if (about.length < 50) errors.push("About must be 50 characters or more");
        if (!city) errors.push("City is required");
        if (!state) errors.push("State is required");

        if (!errors.length) {
            setErrors([]);
            const updatedGroup = await dispatch(thunkEditGroup({ name, about, type, isPrivate, city, state }, currentGroup.id))

            if (updatedGroup.ok) {
                // console.log('new group: ', updatedGroup)
                closeModal()
                return history.push(`/groups/${updatedGroup.id}`)
            } else {
                console.log(updatedGroup)
            }
        } else {
            return setErrors(errors);
            
        }

            
    };

    return (
        <>
            <h1>Edit Group</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <label>
                    Name
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    About
                    <textarea
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        required
                    ></textarea>
                </label>
                <label>
                    Type
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}>
                        <option value="In person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                <label>
                    Public
                    <input
                        type="radio"
                        value={false}
                        onChange={(e) => setIsPrivate(false)}
                        checked={!isPrivate}
                    />
                </label>
                <label>
                    Private
                    <input
                        type="radio"
                        value={true}
                        onChange={(e) => setIsPrivate(true)}
                        checked={isPrivate}
                    />
                </label>
                <label>
                    City
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    State
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit Changes</button>
            </form>
        </>
    );
}

export default EditGroupModal;