import { csrfFetch } from './csrf';

//////// action variables ////////////
const GET_GROUPS = 'groups/getAllGroups';
const GET_GROUP_DETAILS = 'groups/getGroupDetails';
const CREATE_GROUP = 'groups/createGroup';

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

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
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
        group.ok = true;
        return group;
    } else {
        // const errors = await response.json();
        // return errors;
        return response;
    }
}

export const thunkCreateGroup = (group) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state } = group;
    const newGroupReq = {
        name,
        about,
        type,
        private: isPrivate,
        city,
        state
    }
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGroupReq)
    })
    if (response.ok) {
        const newGroup = await response.json()
        dispatch(createGroup(newGroup))
        return newGroup
    } else {
        return response;
    }
}


//////////// REDUCER ////////////////////
const initialState = {allGroups: {}, singleGroup: {GroupImages: [], Organizer: {}, Venues: []}}

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state, allGroups: {...state.allGroups}}
            action.groups.Groups.forEach(group => newState.allGroups[group.id] = group)
            return newState;
        case GET_GROUP_DETAILS: 
            newState = {...state, allGroups: {...state.allGroups}, singleGroup: {...state.singleGroup, GroupImages: [...state.singleGroup.GroupImages], Organizer: {...state.singleGroup.Organizer}, Venues: [...state.singleGroup.Venues]}}

            newState.singleGroup = {...action.group, GroupImages: [...action.group.GroupImages], Organizer: {...action.group.Organizer}, Venues: [...action.group.Venues]}
            return newState;
        case CREATE_GROUP:
            newState = { ...state, allGroups: { ...state.allGroups }, singleGroup: { ...state.singleGroup, GroupImages: [...state.singleGroup.GroupImages], Organizer: { ...state.singleGroup.Organizer }, Venues: [...state.singleGroup.Venues]}}

            newState.allGroups[action.group.id] = action.group;
            newState.singleGroup = { ...action.group, GroupImages: [...action.group.GroupImages], Organizer: { ...action.group.Organizer }, Venues: [...action.group.Venues] }
            
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;