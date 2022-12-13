//////// action variables ////////////
const GET_GROUPS = 'groups/getAllGroups';
const GET_GROUP_DETAILS = 'groups/getGroupDetails';

////////// action creators ///////////
const getAllGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

const getGroupDetails = (group) => {
    return {
        type: GET_GROUP_DETAILS,
        group
    }
}

//////////// THUNK action creators ////////////////
export const thunkGetAllGroups = () => async (dispatch) => {
    const response = await fetch('/api/groups');
    if (response.ok){
        const groups = await response.json();
        dispatch(getAllGroups(groups))
        return groups;
    }
}

export const thunkGetGroupDetails = (groupId) => async (dispatch) => {
    const response = await fetch(`/api/groups/${groupId}`);
    if (response.ok) {
        const group = await response.json();
        dispatch(getGroupDetails(group));
        return group;
    } else {
        const errors = response.json();
        return errors;
    }
}


//////////// REDUCER ////////////////////
const initialState = {allGroups: {}, singleGroup: {}}

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state, allGroups: {...state.allGroups}}
            action.groups.Groups.forEach(group => newState.allGroups[group.id] = group)
            return newState;
        case GET_GROUP_DETAILS: 
            newState = {...state, allGroups: {...state.allGroups}, singleGroup: {...state.singleGroup}}
            newState.singleGroup = action.group
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;