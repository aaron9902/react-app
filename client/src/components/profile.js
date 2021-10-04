import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useSelector } from "react-redux";

function Profile() {
  const { id } = useParams();
  const user = useSelector(state => state.user)
  const [userData, setUserData] = useState("");
  const [usersThreads, setUsersThreads] = useState([]);
  const [auth, setAuth] = useState(false);

  const [threadTitle, setThreadTitle] = useState("");
  const [threadDesc, setThreadDesc] = useState("");

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

  const edit = (threadID, title, desc) => {
    var newTitle = threadTitle == "" ? title : threadTitle; //if useEffect is empty (i.e. no changes made), use the existing title/desc
    var newDesc = threadDesc == "" ? desc : threadDesc;
    var data = {
      title: newTitle,
      desc: newDesc,
    };
    axios.patch('/api/threads/' + threadID, data).then((res) => {
      console.log(res);
      window.location.reload();
    });
  }

  const deleteThread = (threadID) => {
    axios.delete('/api/threads/' + threadID).then((res) => {
      console.log("thread deleted");
      window.location.reload();
    });
  }

  return (
    <div>
      <h1>{userData.name}'s profile</h1>
      <h2>Posts</h2>
      {usersThreads.length == 0 ? <p>No posts yet :(</p> : (
        <div>
          <ul>
            {usersThreads.map(thread => (
              <li key={thread._id}>
                <Link to={"/forums/" + id + '/thread/' + thread._id}>
                  <h3>{thread.title}</h3>
                </Link>
                <p>Posted at {moment(thread.date).format('MMM Do YYYY')}, in
                  <Link to={'/forums/' + thread.forumParent._id}> {thread.forumParent.title}</Link>
                </p>
                {auth == true ? ( //display editing/deleting options if user is authenticated
                  <div>
                    <Popup trigger={<button>Edit</button>} modal>
                      <input
                        type="text"
                        placeholder="Title"
                        defaultValue={thread.title}
                        onChange={e => setThreadTitle(e.target.value)}
                        required
                        style={{ width: "100%" }}
                      />
                      <br /><br />
                      <textarea
                        placeholder="Description"
                        defaultValue={thread.desc}
                        onChange={e => setThreadDesc(e.target.value)}
                        required
                        rows={10}
                        maxLength="300"
                        style={{ width: "100%", whiteSpace: "pre-line" }}
                      />
                      <br />
                      <button onClick={() => { edit(thread._id, thread.title, thread.desc) }}>Edit</button>
                    </Popup>
                    <Popup trigger={<button>Delete</button>} modal>
                      <p>Are you sure you want to delete this thread? This can not be undone.</p>
                      <button onClick={() => { deleteThread(thread._id) }}>Delete</button>
                    </Popup>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default withRouter(Profile);