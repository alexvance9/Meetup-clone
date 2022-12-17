import { useState } from "react";
import GroupComponents from "../GroupComponents";
import EventComponents from "../EventComponents";
import './HomePage.css'

const HomePage = ({isEvent}) => {
    // two buttons groups and events
    // renders group or event components depending on what is clicked
    // default to groups
    // console.log(isEvent)
    const [ isEvents, setIsEvents ] = useState(isEvent);
    // const [selected, setSelected] = useState("selected")
    

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
        <div className="home-page">
            <div className="page-tabs">
            <button onClick={groupClick} className={isEvents ? "" : "selected"}>Groups</button>
                <button onClick={eventClick} className={isEvents ? "selected" : ""}>Events</button>
            </div>
            {pageComponents}
        </div>
    )
}



export default HomePage