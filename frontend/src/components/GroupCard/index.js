import './GroupCard.css'
import { NavLink } from 'react-router-dom';

const GroupCard = ({ group }) => {
    
    if(!group) return null;
    return (
        
        <NavLink to={`/groups/${group.id}`} activeClassName='group-card-nav'>
        <div className="group-card">
            <div className="preview-image">
                    <img src={group.previewImage ? group.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt={group.name}/>
            </div>
            <div className="group-card-flex-container">  
                <div className="group-card-header">
                    <h3>{group.name}</h3>
                    <span>{group.city}, {group.state}</span>
                </div>
                <div className="description">
                        
                            {group.about}
                        
                </div>
                <div className="group-card-footer">
                    {group.numMembers} &#x2022; {group.private === true ? "Private" : "Public"}
                </div>
            </div>
        </div>
        </NavLink>
    )
}


export default GroupCard;