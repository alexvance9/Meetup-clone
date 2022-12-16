import { csrfFetch } from "./csrf";

/////////// action variables ///////////////
const GET_EVENTS = 'events/getAllEvents';
const GET_EVENT_DETAILS = 'events/getEventDetails';
const CREATE_EVENT = 'events/createEvent';
const EDIT_EVENT = 'events/editEvent';


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

const createEvent = (event) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

const editEvent = (event) => {
    return {
        type: EDIT_EVENT,
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

export const thunkCreateEvent = (event) => async (dispatch) => {
    const {currentGroupId, name, type, capacity, price, description, start, end, previewImageURL } = event;
    const newEventReq = {
        name,
        type,
        capacity,
        price,
        description,
        startDate: start,
        endDate: end
    }
    const newPreviewImgReq = {
        url: previewImageURL,
        preview: true
    }
    const response = await csrfFetch(`/api/groups/${currentGroupId}/events`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newEventReq)
    })
    if (response.ok) {
        const newEvent = await response.json();
        const imgResponse = await csrfFetch(`/api/events/${newEvent.id}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPreviewImgReq)
        })
        if(imgResponse.ok) {
            dispatch(createEvent(newEvent))
            newEvent.ok = true;
            return newEvent;
        }
    } else return response.json();

}


export const thunkEditEvent = (event) => async (dispatch) => {
    const { eventId, name, type, capacity, price, description, start, end } = event;

    const editEventReq = {
        name,
        type,
        capacity,
        price,
        description,
        startDate: start,
        endDate: end
    }

    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(editEventReq)
    })

    if (response.ok) {
        const updatedEventDetails = await csrfFetch(`/api/events/${eventId}`);
        const updatedEvent = await updatedEventDetails.json()
        dispatch(editEvent(updatedEvent));
        updatedEvent.ok = true;
        return updatedEvent;
    } else return response.json()
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
        case CREATE_EVENT: {
            const newState = {...state, allEvents: {...state.allEvents}}
            newState.allEvents[action.event.id] = {...action.event, Group: {...action.event.Group}, Venue: {}};
            return newState;
        }
        case EDIT_EVENT: {
            const newState = { ...state, allEvents: { ...state.allEvents }, singleEvent: { Group: {}, Venue: {}, EventImages: []}}
            newState.singleEvent = {...action.event, Group: {...action.event.Group}, Venue: {...action.event.Venue}, EventImages: [...action.event.EventImages]}
            return newState;
        }
        default: 
            return state;
    }
}

export default eventsReducer;