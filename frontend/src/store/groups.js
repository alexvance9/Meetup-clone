import { csrfFetch } from './csrf';

//////// action variables ////////////
const GET_GROUPS = 'groups/getAllGroups';
const GET_GROUP_DETAILS = 'groups/getGroupDetails';
const CREATE_GROUP = 'groups/createGroup';
const EDIT_GROUP = 'groups/editGroup';
const DELETE_GROUP = 'groups/deleteGroup';


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

const editGroup = (group) => {
    return {
        type: EDIT_GROUP,
        group
    }
} 

const deleteGroup = () => {
    return {
        type: DELETE_GROUP
    }
}

//////////// THUNK action creators ////////////////
export const thunkGetAllGroups = () => async (dispatch) => {
    try {
    const response = await csrfFetch('/api/groups');
    // if (response.ok){
        const groups = await response.json();
        dispatch(getAllGroups(groups))
        return groups;
    } catch (e) {
        return await e.json()
    }
}

export const thunkGetGroupDetails = (groupId) => async (dispatch) => {
    

    try{
        const response = await csrfFetch(`/api/groups/${groupId}`);
        const group = await response.json();
        const response2 = await csrfFetch(`/api/groups/${groupId}/events`)
        const groupEvents = await response2.json()
        group['events'] = groupEvents.Events
        // console.log(group)
        dispatch(getGroupDetails(group));
        group.ok = true;
        return group;
    } catch (e) {
       
        return await e.json();
    }
}

export const thunkCreateGroup = (group) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state, previewImageURL } = group;
    const newGroupReq = {
        name,
        about,
        type,
        private: isPrivate,
        city,
        state
    }
    const newPreviewImgReq = {
        url: previewImageURL,
        preview: true
    }
    try {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newGroupReq)
    })
    if (response.ok) {
        const newGroup = await response.json()
        const imgResponse = await csrfFetch(`/api/groups/${newGroup.id}/images`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPreviewImgReq)
        })
        if (imgResponse.ok) {
            dispatch(createGroup(newGroup))
            newGroup.ok = true;
            return newGroup;
        }
    }
    } catch (e) {
        return await e.json();
} }


export const thunkEditGroup = (group, groupId) => async (dispatch) => {
    const { name, about, type, isPrivate, city, state } = group;
    const updateRequest = {
        name,
        about,
        type,
        private: isPrivate,
        city,
        state
    }
        try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updateRequest)
    })
    if (response.ok) {
        const updatedGroup = await response.json()
        dispatch(editGroup(updatedGroup))
        updatedGroup.ok = true;
        return updatedGroup;}
    } catch (e) {
        return await e.json();
    }
}

export const thunkDeleteGroup = (groupId) => async (dispatch) => {
    
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    })
    if (response.ok) {
        dispatch(deleteGroup())
        const message = await response.json()
        message.ok = true;
        return message;
    } } catch (e) {
        return await e.json();
    }
}


//////////// REDUCER ////////////////////
const initialState = {allGroups: {}, singleGroup: {GroupImages: [], Organizer: {}, Venues: [], Events: []}}

const groupsReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case GET_GROUPS:{
            const newState = { allGroups: {}, singleGroup: { GroupImages: [], Organizer: {}, Venues: [], Events: [] } }
            action.groups.Groups.forEach(group => newState.allGroups[group.id] = group)
            return newState;
        }
        case GET_GROUP_DETAILS: {
            const newState = { ...state, allGroups: {...state.allGroups}, singleGroup: { GroupImages: [], Organizer: {}, Venues: [], Events: [] } }

            newState.singleGroup = {...action.group, GroupImages: [...action.group.GroupImages], Organizer: {...action.group.Organizer}, Venues: [...action.group.Venues], Events: [...action.group.events]}
            return newState;
        }
        case CREATE_GROUP:{
            const newState = { ...state, allGroups: { ...state.allGroups }}

            newState.allGroups[action.group.id] = action.group;            
            return newState;
        }
        case EDIT_GROUP: {
            const newState = { ...state, allGroups: { ...state.allGroups }, singleGroup: { ...state.singleGroup, GroupImages: [...state.singleGroup.GroupImages], Organizer: {...state.singleGroup.Organizer}, Venues: [...state.singleGroup.Venues], Events: [...state.singleGroup.Events] } };
            
            newState.singleGroup = { ...action.group, numMembers: newState.singleGroup.numMembers, GroupImages: [...state.singleGroup.GroupImages], Organizer: { ...state.singleGroup.Organizer }, Venues: [...state.singleGroup.Venues], Events: [...state.singleGroup.Events] }

            return newState;
        }
        case DELETE_GROUP: {
            const newState = { allGroups: {}, singleGroup: { GroupImages: [], Organizer: {}, Venues: [], Events: [] } }
            return newState;
        }
        default:
            return state;
    }
}

export default groupsReducer;