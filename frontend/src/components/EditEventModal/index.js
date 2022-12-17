import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkEditEvent } from '../../store/events';
import './EditEventModal.css'


const EditEventModal = ({ currentEvent }) => {

    // console.log(currentEvent)
    const dispatch = useDispatch();
    const history = useHistory();

    const [name, setName] = useState(currentEvent.name);
    const [type, setType] = useState(currentEvent.type);
    const [capacity, setCapacity] = useState(currentEvent.capacity);
    const [price, setPrice] = useState(currentEvent.price);
    const [description, setDescription] = useState(currentEvent.description);
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    // const [previewImageURL, setPreviewImageURL] = useState(currentEvent.previewImageURL)
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    // validations: 
    // name at least 5 chars, description not null,
    // type "In Person", "Online"
    // capacity min 2, integer
    // price req'd, must be number
    // start date must be in the future --- datetime input does have a min/max attribute.
    // end date must be after start date

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        // console.log(typeof capacity)

        const currentDate = new Date();
        const startString = startDate + " " + startTime;
        const start = new Date(startString)
        // console.log(start)

        const endString = endDate + " " + endTime;
        const end = new Date(endString);
        const eventId = currentEvent.id;

        if (name.length < 5) errors.push("event name must be at least 5 characters long")
        if (description.length <= 0) errors.push("please provide an event description")
        if (capacity < 2) errors.push("capacity must be at least 2")
        if (price < 0) errors.push("please specify a price for the event. 0 means the event is free!")
        if (start <= currentDate) errors.push("start date must be in the future")
        if (start >= end) errors.push("end date must be greater than start date")

        if (!errors.length) {
            setErrors([]);
            const updatedEvent = await dispatch(thunkEditEvent({ eventId, name, type, capacity, price, description, start, end }))

            if (updatedEvent.ok) {
                closeModal()
                return history.push(`/events/${updatedEvent.id}`)
            } else {
                console.log(updatedEvent)
            }
        }
        return setErrors(errors);
    }



    return (
        <div className="edit-event-modal">
            <h1>Edit Event</h1>
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
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </label>
                <label>
                    Type
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}>
                        <option value="In Person">In Person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                <label>
                    Capacity
                    <input
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(+e.target.value)}

                    />
                </label>
                <label>
                    Price
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(+e.target.value)}

                    />
                </label>
                <label>
                    Start Date
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Start Time
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Date
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </label>
                <label>
                    End Time
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Submit Changes</button>
            </form>

        </div>
    )
}

export default EditEventModal;

                // <label>
                //     Preview Image
                //     <input
                //         type="text"
                //         value={previewImageURL}
                //         onChange={(e) => setPreviewImageURL(e.target.value)}
                //         required
                //     ></input>
                // </label>