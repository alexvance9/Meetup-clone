// import { NavLink } from 'react-router-dom';

const EventCard = ({ event }) => {
    
    if (!event) return null;

    const eventDate = new Date(event.startDate).toUTCString();
    
    return (
        
        <div className="event-card">
            <div className="preview-image">
                <img src={event.previewImage ? event.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt={event.name} />
            </div>
            <div className="event-card-flex-container">
                <div className="event-card-header">
                    <span>{eventDate}</span>
                    <h3>{event.name}</h3>
                    <h3>{event.Group.name} &#x2022; {event.Group.city}, {event.Group.state}</h3>
                </div>
            
                <div className="event-card-footer">
                    {event.numAttending} attendees
                </div>
            </div>
        </div>
    )
}
export default EventCard;