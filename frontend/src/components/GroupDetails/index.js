import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetails } from "../../store/groups";

const GroupDetails = () => {
    let { groupId } = useParams();
    const dispatch = useDispatch();
    const [ isLoaded, setIsLoaded ] = useState(true)
    const groupDetails = useSelector(state => state.groups.singleGroup);

    useEffect(() => {
       (async () => {
        const response = await dispatch(thunkGetGroupDetails(groupId))
        if (!response.ok){ 
            setIsLoaded(false)
        } else {
            setIsLoaded(true)
        }
       })()
    }, [dispatch, groupId])

    // console.log('fetched group details: ', groupDetails)
    // console.log(isLoaded)

   if (!isLoaded) return (<span>That Group doesn't exist yet!</span>);
//    find the preview image in the groupimages array since previewimage doesn't come back with group details

   const previewImage = groupDetails.GroupImages.find(image => image.preview === true)

    return (
        <>
        <div className='group-details'>
            <div className="details-header">
                <span id='preview-image'>
                        <img src={previewImage ? previewImage.url : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"}alt={groupDetails.name} />
                </span>
                <div className="header-info">
                    <h2>{groupDetails.name}</h2>
                    <h3>{groupDetails.city}, {groupDetails.state}</h3>
                    <h3>{groupDetails.numMembers} members &#x2022; {groupDetails.private === true ? "Private" : "Public"}</h3>
                    <h3>Organized by {groupDetails.Organizer.firstName} {groupDetails.Organizer.lastName}</h3>
                </div>
                <div className='group-about'>
                    <h2>What we're about</h2>
                    <p>{groupDetails.about}</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default GroupDetails;