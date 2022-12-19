import { NavLink } from "react-router-dom";
import './SplashPage.css'

const SplashPage = () => {
    return (
        <div className="splash">
            <div className="splash-header">
                <div className="splash-header-left">

                <h1>Welcome to HangOut!</h1>
                <h3>A clone of Meetup.com</h3>
                <div className="splash-description">
                    This was my first fullstack clone project while in App Academy.
                    Technologies used:
                    <ul className="technologies">
                        <li>JavaScript and Node.js</li>
                        <li>Express and Sequelize/PostgreSQL backend</li>
                        <li>React and Redux frontend</li>
                    </ul>
                    Building this clone was as enjoyable and rewarding as it was challenging! Please click around and take a look.
                </div>
                </div>
                <div className="splash-image">
                    <img alt='meetup-splash' src="https://camo.githubusercontent.com/4375ce04d14334c8753e8068a3ec86fe2b0efcd3861161b7239dad21f9e3230c/68747470733a2f2f696d672e6672656570696b2e636f6d2f766563746f722d7072656d69756d2f636f6e636570746f2d6d65657475702d636f6c656761732d656d707265736172696f732d706572736f6e616a65732d656d706c6561646f732d656d70726573612d70617573612d636166652d706572736f6e61732d7175652d636f6d756e6963616e2d636861726c616e2d706173616e2d7469656d706f2d6c696272652d6a756e746f732d646973637574656e2d6375657374696f6e65732d6c61626f72616c65732d696c757374726163696f6e2d766563746f7269616c2d646962756a6f732d616e696d61646f735f38373737312d31343238322e6a7067"/>
                </div>
            </div>
            <div className="splash-links">
                <NavLink to='/groups'>
                    <div className="splash-link">
                        <div className="link-image">
                        <img alt='link to groups' src="https://secure.meetupstatic.com/next/images/indexPage/category3.webp?w=1920" />
                        </div>

                        <div className="splash-link-text">Explore Groups <i className="fa-solid fa-arrow-right"></i></div>
                    </div>
                </NavLink>
                <NavLink to='/events'>
                    <div className="splash-link">
                        <div className="link-image">
                        <img alt='link to events' src="https://secure.meetupstatic.com/next/images/indexPage/category2.webp?w=1920" />
                        </div>

                        <div className="splash-link-text">Find an Event <i className="fa-solid fa-arrow-right"></i></div>
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default SplashPage;