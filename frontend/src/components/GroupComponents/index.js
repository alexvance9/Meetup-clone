// import { useSelector } from "react-redux";
import ShowGroups from "../ShowGroups";
// import OpenModalButton from "../OpenModalButton";
// import CreateGroupModal from "../CreateGroupModal";

const GroupComponents = () => {
    // const sessionUser = useSelector(state => state.session.user)

    // let sessionButton;
    // if (sessionUser) {
    //     sessionButton = (
    //         <div className="create-group-button">
    //             <OpenModalButton
    //                 buttonText="Create New Group"
    //                 modalComponent={<CreateGroupModal />}
    //                 />    
    //         </div>
    //         )

    // }

    return (
        <div className="group-components">
            <ShowGroups />
            {/* {sessionButton} */}
        </div>
    )
}

export default GroupComponents;