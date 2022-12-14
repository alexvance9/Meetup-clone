import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllGroups } from '../../store/groups'
import GroupCard from '../GroupCard';
import './ShowGroups.css'

const ShowGroups = () => {
    const dispatch = useDispatch();
    const groups = useSelector(state => state.groups.allGroups);
   
    const groupsArray = Object.values(groups);
    
    useEffect(() => {
       dispatch(thunkGetAllGroups()); 
    }, [dispatch])
    

    if (Object.keys(groups).length === 0) {
        return null;
    }
    
    return (
        <div className='cards-container'>
            {groupsArray.map(group => (
                <GroupCard group={group} key={group.id} />
            ))}
        </div>
    )
}

export default ShowGroups;