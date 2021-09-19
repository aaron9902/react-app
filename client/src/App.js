import React, { Profiler, Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from './hoc/auth'

import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import NavBar from "./components/Navbar/NavBar";
import Footer from "./components/Footer";
import Forums from './components/forums'
import ForumSelect from './components/forumSelect'
import ThreadSelect from './components/threadSelect'
import PostThread from './components/postThread'
import Profile from './components/profile'

//Route Options
//null    =>  everyone can access this page (landing page and About page)
//true    =>  logged in users can access this page ()
//false   =>  logged in users CANNOT access this page (register and login page)
function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />

          <Route exact path="/forums" component={Auth(Forums, null)} />
          <Route exact path="/forums/:id" component={Auth(ForumSelect, null)} />
          <Route exact path="/forums/:forumID/thread/:threadID" component={Auth(ThreadSelect, null)} />

          <Route exact path="/forums/:id/post" component={Auth(PostThread, true)} />

          <Route exact path="/profile/:id" component={Auth(Profile, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}


export default App;
