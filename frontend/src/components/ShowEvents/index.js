import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkGetAllEvents } from "../../store/events";
import EventCard from "../EventCard";


const ShowEvents = () => {
    const dispatch = useDispatch();
    const events = useSelector(state => state.events.allEvents)

    const eventsArray = Object.values(events)

    const eventsCopy = [...eventsArray]
    function removePastEvents(array) {
        for (let i = 0; i < array.length; i++) {
            let event = array[i]
            let now = new Date()
            let eventStart = new Date(event.startDate)
            if (eventStart < now) {
                array.splice(i, 1)
            }
        }
        return array;
    }
    const noPastEvents = removePastEvents(eventsCopy)
    function dateSorter(a, b){
        let aDate = new Date(a.startDate)
        let bDate = new Date(b.startDate)
        return aDate - bDate
    }
    const sortedEvents = noPastEvents.sort(dateSorter)
    // console.log(sortedEvents)
    

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
            {sortedEvents.map(event => (
                <EventCard event={event} key={event.id} />
            ))}
        </div>
    )
}

export default ShowEvents;