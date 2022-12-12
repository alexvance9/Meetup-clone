const GET_GROUPS = 'groups/getAllGroups';


const getAllGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
}

export const thunkGetAllGroups = () => async (dispatch) => {
    const response = await fetch('/api/groups');
    if (response.ok){
        const groups = await response.json();
        dispatch(getAllGroups(groups))
        return groups;
    }
}

const initialState = {allGroups: {}, singleGroup: {}}

const groupsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state}
            action.groups.Groups.forEach(group => newState.allGroups[group.id] = group)
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;