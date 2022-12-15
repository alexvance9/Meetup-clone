import { useState } from "react";
import GroupComponents from "../GroupComponents";
import EventComponents from "../EventComponents";

const HomePage = () => {
    // two buttons groups and events
    // renders group or event components depending on what is clicked
    // default to groups
    const [ isEvents, setIsEvents ] = useState(false);


    const groupClick = (e) => {
        e.preventDefault();
        setIsEvents(false)
    }
    const eventClick = (e) => {
        e.preventDefault();
        setIsEvents(true);
    }

    let pageComponents;
    if (isEvents) {
        pageComponents = (
            <EventComponents />
        )
    } else {
        pageComponents = (
            <GroupComponents />
        )
    }

    return (
        <div className="body">
            <button onClick={groupClick}>Groups</button>
            <button onClick={eventClick}>Events</button>
            {pageComponents}
        </div>

    )
}

export default HomePage