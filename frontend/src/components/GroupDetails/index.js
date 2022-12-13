import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { thunkGetGroupDetails } from "../../store/groups";

const GroupDetails = () => {
        let { groupId } = useParams();
        const dispatch = useDispatch();
        const groupDetails = useSelector(state => state.groups.singleGroup);

        useEffect(() => {
            dispatch(thunkGetGroupDetails(groupId))
        }, [dispatch, groupId])

        if (!groupDetails) {
            return null;
        }

    return (
        <div>this is a group detail page!</div>
    )
}

export default GroupDetails;