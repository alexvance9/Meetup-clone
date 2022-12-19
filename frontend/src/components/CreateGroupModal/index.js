import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkCreateGroup } from '../../store/groups';
import "./CreateGroupModal.css"


function CreateGroupModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("In person");
    const [isPrivate, setIsPrivate] = useState(false);
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [previewImageURL, setPreviewImageURL] = useState("")
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        if (name.length > 60) errors.push("Name must be 60 characters or less");
        if (about.length < 50) errors.push("About must be 50 characters or more");
        if (!city) errors.push("City is required");
        if (!state) errors.push("State is required");
        if (!previewImageURL) errors.push("Preview Image is required");
        
        if (!errors.length) {
            setErrors([]);
            const newGroup = await dispatch(thunkCreateGroup({ name, about, type, isPrivate, city, state, previewImageURL }))

            if(newGroup.ok){
                // console.log('new group: ', newGroup)
                closeModal()
                return history.push(`/groups/${newGroup.id}`)
            } else {
                newGroup.errors.forEach(error => errors.push(error))
            }
        }
        return setErrors(errors);
    };
            

    return (
        <div className="create-group-modal">
            <h1>Create New Group</h1>
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
               <div className="radio-buttons"> 
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
                </div>
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
                <label>
                    Preview Image
                    <input
                        type="text"
                        value={previewImageURL}
                        onChange={(e) => setPreviewImageURL(e.target.value)}
                        required
                    ></input>
                </label>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroupModal;