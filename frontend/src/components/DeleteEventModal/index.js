import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteEvent } from '../../store/events';

function DeleteEventModal({ currentEventId }) {
    const dispatch = useDispatch();
    const history = useHistory();

    // add error handling here

    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();

        const deleteEvent = await dispatch(thunkDeleteEvent(currentEventId))

        if (deleteEvent.ok) {
            closeModal()
            history.push('/home')
        } 
    }

    return (
        <div className="delete-modal">
            <h2>Are you sure you want to delete this Event?</h2>
            <h3>This will also delete all associated Photos.</h3>
            <button onClick={handleDelete}>Yes, Delete it.</button>
            <button onClick={closeModal}>No, Dont!</button>
        </div>
    )

}

export default DeleteEventModal;