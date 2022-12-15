import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import HomePage from "./components/HomePage";
import SplashPage from "./components/SplashPage";
import GroupDetails from "./components/GroupDetails";
import EventDetails from "./components/EventDetails";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path='/events/:eventId'>
            <EventDetails />
          </Route>
          <Route path='/groups/:groupId'>
            <GroupDetails />
          </Route>
          <Route path={['/events']}>
            <HomePage isEvent={true}/>
          </Route>
          <Route path={['/home', '/groups']}>
            <HomePage isEvent={false}/>
          </Route>
          <Route exact path='/'>
            <SplashPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;