import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';

import { useSelector } from "react-redux";

function Profile() {
  const { id } = useParams();
  const user = useSelector(state => state.user)
  const [userData, setUserData] = useState("");
  const [usersThreads, setUsersThreads] = useState([]);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/users/search/' + id).then((res) => {
      if (isMounted) setUserData(res.data);
    });
    axios.get('/api/users/threads/' + id).then((res) => {
      if (isMounted) setUsersThreads(res.data);
    })
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    user.userData && id == user.userData._id ? setAuth(true) : setAuth(false); //allow editing if the logged in user and profile are the same
  }) //has to be in a useEffect with no dependency since it takes some time fetch the user.

  return (
    usersThreads.length == 0 ? null : (
      <div>
        <h1>{userData.name}'s profile</h1>
        <h2>Posts</h2>
        <ul>
          {usersThreads.map(thread => (
            <li key={thread._id}>
              <Link to={"/forums/" + id + '/thread/' + thread._id}>
                <h3>{thread.title}</h3>
              </Link>
              <p>Posted at {moment(thread.date).format('MMM Do YYYY')}, in
                <Link to={'/forums/' + thread.forumParent._id}> {thread.forumParent.title}</Link>
              </p>
              {auth == true ? (<p>Yep thats me</p>) : null}
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

export default withRouter(Profile);