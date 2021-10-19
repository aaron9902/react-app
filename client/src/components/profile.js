import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { useSelector } from "react-redux";

function Profile() {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
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
      if (isMounted) {
        setUserData(res.data);
        axios.get('/api/users/threads/' + id).then((res) => {
          setUsersThreads(res.data);
          setLoading(false);
        })
      }
    })
    .catch((error) => {
      setError(true);
    })
    return () => { isMounted = false };
  }, []);

  useEffect(() => {
    user.userData && id == user.userData._id ? setAuth(true) : setAuth(false); //allow editing if the logged in user and profile are the same
  }) //has to be in a useEffect with no dependency since it takes some time fetch the user.

  useEffect(()=> {
    document.title = !userData.name ? document.title : userData.name + "'s profile";
  })

  const edit = (threadID, title, desc) => {
    var newTitle = threadTitle == "" ? title : threadTitle; //if useEffect is empty (i.e. no changes made), use the existing title/desc
    var newDesc = threadDesc == "" ? desc : threadDesc;
    var data = {
      title: newTitle,
      desc: newDesc,
    };
    axios.patch('/api/threads/' + threadID, data).then((res) => {
      window.location.reload();
    });
  }

  const deleteThread = (threadID) => {
    axios.delete('/api/threads/' + threadID).then((res) => {
      window.location.reload();
    });
  }

  return (
    isError ? <p>Profile not found</p> : isLoading ? null :
      <div className="container">
        <h1>{userData.name}'s profile</h1>
        <h2>Posts</h2>
        {usersThreads.length == 0 ? <p>No posts yet :(</p> : (
          <div>
            <ul>
              {usersThreads.map(thread => (
                <li className="card" key={thread._id}>
                  <Link to={"/forums/" + id + '/thread/' + thread._id}>
                    <h3>{thread.title}</h3>
                  </Link>
                  <p>Posted at {moment(thread.date).format('MMM Do YYYY')}
                    , in <span className='link'><Link to={'/forums/' + thread.forumParent._id}>{thread.forumParent.title}</Link></span>
                  </p>
                  {auth == true ? ( //display editing/deleting options if user is authenticated
                    <div>
                      <Popup trigger={<button className='top-right2 btn'>Edit</button>} modal>
                        <div className="container">
                          <br />
                          <label>Title</label>
                          <input
                            type="text"
                            placeholder="Title"
                            defaultValue={thread.title}
                            onChange={e => setThreadTitle(e.target.value)}
                            required
                            style={{ marginTop: 0, width: "100%" }}
                          />
                          <label>Description</label>
                          <textarea
                            placeholder="Description"
                            defaultValue={thread.desc}
                            onChange={e => setThreadDesc(e.target.value)}
                            required
                            rows={8}
                            maxLength="300"
                            style={{ width: "100%", whiteSpace: "pre-line" }}
                          />
                          <button className=" vertical-center btn" style={{ marginTop: 10 }} onClick={() => { edit(thread._id, thread.title, thread.desc) }}>Edit</button>
                        </div>
                      </Popup>
                      <Popup trigger={<button className='top-right btn'>Delete</button>} modal>
                        <div className="container">
                          <br />
                          <p style={{ textAlign: 'center' }}>Are you sure you want to delete this thread? This can not be undone.</p>
                          <button className='vertical-center btn' onClick={() => { deleteThread(thread._id) }}>Delete</button>
                        </div>
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