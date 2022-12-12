import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetAllGroups } from '../../../store/groups'
import GroupCard from '../GroupCard';

const ShowGroups = () => {
    const dispatch = useDispatch();
    const groups = useSelector(state => state.groups.allGroups);
    console.log(groups)

    const groupsArray = [...Object.values(groups)]
    // console.log(groupsArray)

    useEffect(() => {
        dispatch(thunkGetAllGroups())
    }, [dispatch])

    if (!groups) return null

    
    return (
        <div>
            {groupsArray.map(group => (
                <GroupCard group={group} />
            ))}
        </div>
    )
}

export default ShowGroups;