import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { thunkGetEventDetails } from "../../store/events";
import OpenModalButton from "../OpenModalButton";
import EditEventModal from "../EditEventModal";
import DeleteEventModal from "../DeleteEventModal";
import './EventDetails.css'

const EventDetails = () => {
    let { eventId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(true);
    const eventDetails = useSelector(state => state.events.singleEvent);

    // console.log(eventDetails.Group.organizerId)
    const organizer = eventDetails.Group.organizerId;

    useEffect(() => {
        (async () => {
            const response = await dispatch(thunkGetEventDetails(eventId))
            if (!response.ok) {
                setIsLoaded(false)
            } else {
                setIsLoaded(true)
            }
        })()
    }, [dispatch, eventId])

    const sessionUser = useSelector(state => state.session.user);
    let sessionLinks;
    if(sessionUser && sessionUser.id === organizer){
        sessionLinks = (
            <div className="session-event-buttons">
                <OpenModalButton
                    buttonText="Edit this Event"
                    modalComponent={<EditEventModal currentEvent={eventDetails} />}
                    />
                <OpenModalButton
                    buttonText="Delete this Event"
                    modalComponent={<DeleteEventModal currentEventId={eventDetails.id} />} 
                    />
            </div>
        )
    }

    if (!isLoaded) return (<span>That Event doesn't exist yet!</span>);
    //    find the preview image in the groupimages array since previewimage doesn't come back with group details

    const previewImage = eventDetails.EventImages.find(image => image.preview === true)

    return (
        <div className='event-details'>
        <div className='event-details-header'>
                <h2>{eventDetails.name}</h2>
            </div>
            <div className="event-details-body">
                <div className="event-details-body-left">
                    <div className="event-detail-preview-image">
                        <img src={previewImage ? previewImage.url : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt={eventDetails.name} />
                    </div>
                {sessionLinks}
                    <div className="event-details-description">
                        <h3>Details</h3>
                        <span>{eventDetails.description}</span>
                    </div>
                </div>
                <div className="event-details-body-right">
                    <div className="event-group-details">
                        <span>{eventDetails.Group.name}</span>
                        <span>{eventDetails.Group.private ? "Private Group" : "Public Group"}</span>
                        <span>{eventDetails.Group.city}, {eventDetails.Group.state}</span>
                    </div>
                    <div className="event-time-place-box">
                        <div className="event-date">
                            <span>
                                Start Date: {eventDetails.startDate}
                            </span>
                            <span>
                               End Date: {eventDetails.endDate}
                            </span>
                        </div>
                        {/* <div className="event-venue">
                            <span>{eventDetails.Venue.address}</span>
                            <span>{eventDetails.Venue.city}, {eventDetails.Venue.state}</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default EventDetails;