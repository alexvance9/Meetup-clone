import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateGroupModal from '../CreateGroupModal'
import './Navigation.css';
import logo from '../../assets/logo.jpeg'


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);

    let sessionLinks;
    if (sessionUser) {
        sessionLinks = (
            <div className="logged-in-nav">
                <div className="create-group-button">
                    <OpenModalButton
                        buttonText="Create New Group"
                        modalComponent={<CreateGroupModal />}
                    />
                </div>
                <ProfileButton user={sessionUser} />
            </div>
        );
    } else {
        sessionLinks = (
            <div className="logged-out-nav">
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal />}
                />
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignupFormModal />}
                />
            </div>
        );
    }

    return (
        <div className='nav'>
            <span>
                <NavLink exact to="/home"><img className="logo" src={logo} alt="HangOut logo" /></NavLink>
            </span>
            {isLoaded && sessionLinks}
        </div>
    );
}

export default Navigation;