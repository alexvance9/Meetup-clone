import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import EventCard from "../EventCard";


const ShowEvents = () => {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.allEvents)

    const eventsArray = Object.values(events)

    useEffect(() => {
        dispatch(thunkGetAllEvents())
    }, [dispatch])

    if (Object.keys(events).length === 0) {
        return (
            <div> No Events Yet!</div>
        )
    }

    return (
        <div className="cards-container">
            {eventsArray.map(event => (
                <EventCard event={event} key={event.id} />
            ))}
        </div>
    )
}

export default ShowEvents;