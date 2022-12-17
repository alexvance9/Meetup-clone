import './EventCard.css'
import { NavLink } from 'react-router-dom';

const EventCard = ({ event }) => {
    
    if (!event) return null;

    const eventDate = new Date(event.startDate).toUTCString();
    
    return (
        <NavLink to={`/events/${event.id}`}>

        <div className="event-card">
            <div className="preview-image">
                <img src={event.previewImage ? event.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt={event.name} />
            </div>
            <div className="event-card-flex-container">
                <div className="event-card-header">
                    <span>{eventDate}</span>
                    <h3>{event.name}</h3>
                    <span>{event.Group.name} &#x2022; {event.Group.city}, {event.Group.state}</span>
                </div>
            
                <div className="event-card-footer">
                    {event.numAttending} attendees
                </div>
            </div>
        </div>
        </NavLink>
    )
}
export default EventCard;