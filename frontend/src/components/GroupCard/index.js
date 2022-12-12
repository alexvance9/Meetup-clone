

const GroupCard = ({ group }) => {
    
    if(!group) return null;
    return (
        <div className="group-card">
            <span className="previewImage">
                {/* <img src={group.previewImage} alt={group.name}/> */}
            </span>
            <div className="group-card-flex-container">  
                <div className="card-header">
                    <h3>{group.name}</h3>
                    <h3>{group.city}, {group.state}</h3>
                </div>
                <div className="description">
                    {group.about}
                </div>
                <div className="card-footer">
                    {group.numMembers} &#x2022; {group.private === true ? "Private" : "Public"}
                </div>
            </div>
        </div>
    )
}


export default GroupCard;