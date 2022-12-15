import { csrfFetch } from "./csrf";

/////////// action variables ///////////////
const GET_EVENTS = 'events/getAllEvents';
const GET_EVENT_DETAILS = 'events/getEventDetails';


/////////// action creators ////////////////

const getAllEvents = (events) => {
    return {
        type: GET_EVENTS,
        data: events
    }
}

const getEventDetails = (event) => {
    return {
        type: GET_EVENT_DETAILS,
        event
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

export const thunkGetEventDetails = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    if (response.ok) {
        const event = await response.json();
        dispatch(getEventDetails(event))
        event.ok = true;
        return event;
    } else {
        return response;
    }
}

/////////// REDUCER /////////////////

const initialState = {allEvents: {}, singleEvent: {Group: {}, Venue: {}, EventImages: []}}

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_EVENTS: {
            const newState = { allEvents: {}, singleEvent: { Group: {}, Venue: {}, EventImages: [] } }
            action.data.Events.forEach(event => newState.allEvents[event.id] = {...event, Group: {...event.Group}, Venue: {...event.Venue}})
            return newState;
        }
        case GET_EVENT_DETAILS: {
            const newState = { allEvents: { ...state.allEvents }, singleEvent: { Group: {}, Venue: {}, EventImages: [] } }
            newState.singleEvent = {...action.event, Group: {...action.event.Group}, Venue: {...action.event.Venue}, EventImages: [...action.event.EventImages]}
            return newState;
        }
        default: 
            return state;
    }
}

export default eventsReducer;