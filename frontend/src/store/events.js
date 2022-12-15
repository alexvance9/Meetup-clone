import { csrfFetch } from "./csrf";

/////////// action variables ///////////////
const GET_EVENTS = 'events/getAllEvents';


/////////// action creators ////////////////

const getAllEvents = (events) => {
    return {
        type: GET_EVENTS,
        data: events
    }
}

/////////// thunk action creators //////////

export const thunkGetAllEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events');
    if (response.ok) {
        const events = await response.json();
        dispatch(getAllEvents(events))
        return events;
    }
}

/////////// REDUCER /////////////////

const initialState = {allEvents: {}, singleEvent: {Group: {}, Venue: {}, EventImages: {}}}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS: {
            const newState = { allEvents: {}, singleEvent: { Group: {}, Venue: {}, EventImages: {} } }
            action.data.Events.forEach(event => newState.allEvents[event.id] = {...event, Group: {...event.Group}, Venue: {...event.Venue}, EventImages: {...event.EventImages}})
            return newState;
        }
        default: 
            return state;
    }
}

export default eventsReducer;