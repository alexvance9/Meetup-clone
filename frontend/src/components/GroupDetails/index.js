import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetails } from "../../store/groups";
import  OpenModalButton  from '../OpenModalButton';
import  EditGroupModal  from '../EditGroupModal';
import DeleteGroupModal from "../DeleteGroupModal";
import './GroupDetails.css'
import CreateEventModal from "../CreateEventModal";
import EventCard from "../EventCard";

const GroupDetails = () => {
    let { groupId } = useParams();
    const dispatch = useDispatch();
    const [ isLoaded, setIsLoaded ] = useState(true)
    const [isAbout, setIsAbout] = useState(true);
    const [isEvents, setIsEvents] = useState(false);
    const [isPhotos, setIsPhotos] = useState(false);
    const groupDetails = useSelector(state => state.groups.singleGroup);

    useEffect(() => {
       (async () => {
        const response = await dispatch(thunkGetGroupDetails(groupId))
        if (!response.ok){ 
            setIsLoaded(false)
            // console.log(response)
        } else {
            setIsLoaded(true)
        }
       })()
    }, [dispatch, groupId])
    
    //    session edit and delete group buttons if current user is organizer
    const sessionUser = useSelector(state => state.session.user);
    let sessionLinks;
    if (sessionUser && sessionUser.id === groupDetails.organizerId){
        sessionLinks = (
            <div className="session-group-buttons">
                <div className="edit-group-button">
                    <OpenModalButton
                        buttonText="Edit Group"
                        modalComponent={<EditGroupModal currentGroup={groupDetails} />}
                        />
                </div>
                <div className="delete-group-button">
                    <OpenModalButton
                        buttonText="Delete Group"
                        modalComponent={ <DeleteGroupModal currentGroupId={groupId}/>}
                        />
                </div>
                <div className="create-event-button">
                    <OpenModalButton
                    buttonText="Add an Event"
                    modalComponent={<CreateEventModal currentGroupId={groupId} />}
                    />
                </div>
            </div>
        )
    }
    
    if (!isLoaded) return (<span>That Group doesn't exist yet!</span>);
//    find the preview image in the groupimages array since previewimage doesn't come back with group details

   const previewImage = groupDetails.GroupImages.find(image => image.preview === true)

// sort events array by date and exclude old events
    const eventsArray = [...groupDetails.Events]
    // console.log(groupDetails.events)
    // console.log(eventsArray)
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
    const noPastEvents = removePastEvents(eventsArray)
    function dateSorter(a, b) {
        let aDate = new Date(a.startDate)
        let bDate = new Date(b.startDate)
        return aDate - bDate
    }
    const sortedEvents = noPastEvents.sort(dateSorter)

//    onclick for info tabs
    const aboutClick = (e) => {
        e.preventDefault();
        setIsEvents(false)
        setIsPhotos(false)
        setIsAbout(true);
    }

    const eventClick = (e) => {
        e.preventDefault()
        setIsAbout(false)
        setIsPhotos(false)
        setIsEvents(true)
    }
    const photoClick = (e) => {
        e.preventDefault()
        setIsAbout(false)
        setIsEvents(false)
        setIsPhotos(true)
    }

    let infoTab;
    if(isAbout) {
        infoTab = (<div className='group-about'>
            <h2>What we're about</h2>
            <p>{groupDetails.about}</p>
        </div>)
    } else if (isEvents) {
        infoTab = (
            <div className="group-about">
                <h2>Upcoming Events</h2>
                {sortedEvents.map(event => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        )
    } else {
        // is group photos
        infoTab = (
            <div className="images-tab">
                {groupDetails.GroupImages.map(image => (
                    <div className="group-about-image" key={image.id}>
                        <img alt='group' src={image.url}/>
                    </div>
                ))}
            </div>
        )
    }


    return (
        <>
        <div className='group-details'>
            <div className="details-header">
                <div className='detail-preview-image'>
                        <img src={previewImage ? previewImage.url : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}alt={groupDetails.name} />
                </div>
                <div className="header-info">
                    <h2>{groupDetails.name}</h2>
                        <div> <i className="fa-solid fa-location-dot"></i> {groupDetails.city}, {groupDetails.state}</div>
                        <div> <i className="fa-solid fa-users"></i> {groupDetails.numMembers} members &#x2022; {groupDetails.private === true ? "Private" : "Public"}</div>
                        <div><i className="fa-regular fa-user"></i> Organized by {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}</div>
                </div>
            </div>
            <div className="all-details-buttons">

            <div className="group-details-tabs">
                <button type="button" onClick={aboutClick} className={isAbout ? "selected" : ""}>About </button>
                <button type="button" onClick={eventClick} className={isEvents ? "selected" : ""}>Events</button>
                <button type="button" onClick={photoClick} className={isPhotos ? "selected" : ""}>Photos</button>
            </div>
                {sessionLinks}
            </div>
                <div className="details-body">
                   
            {infoTab}
                </div>
        </div>
        </>
    )
}

export default GroupDetails;