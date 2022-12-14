import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetails } from "../../store/groups";
import  OpenModalButton  from '../OpenModalButton';
import  EditGroupModal  from '../EditGroupModal';
import DeleteGroupModal from "../DeleteGroupModal";
import './GroupDetails.css'
import CreateEventModal from "../CreateEventModal";

const GroupDetails = () => {
    let { groupId } = useParams();
    const dispatch = useDispatch();
    const [ isLoaded, setIsLoaded ] = useState(true)
    const [isAbout, setIsAbout] = useState(true);
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

//    onclick for info tabs
    const aboutClick = (e) => {
        e.preventDefault();
        setIsAbout(true);
    }

    const infoClick = (e) => {
        e.preventDefault()
        setIsAbout(false)
    }

    let infoTab;
    if(isAbout) {
        infoTab = (<div className='group-about'>
            <h2>What we're about</h2>
            <p>{groupDetails.about}</p>
        </div>)
    } else {
        infoTab = (
            <div className="group-about">
                <h2>More Info Coming Soon!</h2>
                <p>Stay tuned for exciting new features, including venues, memberships, and photos!</p>
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
                <button type="button" onClick={infoClick} className={!isAbout ? "selected" : ""}>More Info</button>
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