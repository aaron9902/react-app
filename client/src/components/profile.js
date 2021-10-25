import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Upvote from './Upvote'

import { useSelector } from "react-redux";

function Profile() {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { id } = useParams();

  const user = useSelector(state => state.user)
  const [auth, setAuth] = useState(false);

  const [userData, setUserData] = useState("");
  const [usersThreads, setUsersThreads] = useState([]);

  const [threadTitle, setThreadTitle] = useState("");
  const [threadDesc, setThreadDesc] = useState("");

  const [userUpvoteData, setUserUpvoteData] = useState([]);
  const [userDownvoteData, setUserDownvoteData] = useState([]);

  const [display, setDisplay] = useState(0); //0 for posts, 1 for upvotes, 2 for downvotes

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/users/search/' + id).then((res) => {
      if (isMounted) {
        setUserData(res.data);
        axios.get('/api/users/threads/' + id).then((res) => {
          setUsersThreads(res.data);
          setLoading(false);
        })
        axios.get('/api/users/upvotes/' + id).then((res) => {
          setUserUpvoteData(res.data);
        });
        axios.get('/api/users/downvotes/' + id).then((res) => {
          setUserDownvoteData(res.data);
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

  useEffect(() => {
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

  // const PostsDisplay = () => {
  //   console.log("hi")
  //   return (
      
  //   )
  // }

  const UpvotesDisplay = () => {
    return (
      userUpvoteData.length == 0 ? <p>No upvotes yet :(</p> : (
        <div>
          <ul>
            {userUpvoteData.map(thread => (
              <li className="card thread-grid" key={thread._id}>
                <div>
                  <Upvote id={thread._id} />
                </div>
                <div>
                  <Link to={"/forums/" + id + '/thread/' + thread._id}>
                    <h3>{thread.title}</h3>
                  </Link>
                  <p>
                    <span className="link"><Link to={'/forums/' + thread.forumParent._id}> {thread.forumParent.title}</Link></span>
                    {" " + '\u2022'} Posted at {moment(thread.date).format('MMM Do YYYY')}
                    , by <span className="link"><a href={'/profile/' + thread.userParent._id}> {thread.userParent.name}</a></span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    )
  }

  const DownvotesDisplay = () => {
    return (
      userDownvoteData.length == 0 ? <p>No downvotes yet :)</p> : (
        <div>
          <ul>
            {userDownvoteData.map(thread => (
              <li className="card thread-grid" key={thread._id}>
                <div>
                  <Upvote id={thread._id} />
                </div>
                <div>
                  <Link to={"/forums/" + id + '/thread/' + thread._id}>
                    <h3>{thread.title}</h3>
                  </Link>
                  <p>
                    <span className="link"><Link to={'/forums/' + thread.forumParent._id}> {thread.forumParent.title}</Link></span>
                    {" " + '\u2022'} Posted at {moment(thread.date).format('MMM Do YYYY')}
                    , by <span className="link"><a href={'/profile/' + thread.userParent._id}> {thread.userParent.name}</a></span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    )
  }

  return (
    isError ? <p>Profile not found</p> : isLoading ? null :
      <div className="container">
        <h1>{userData.name}'s profile</h1>
        <a onClick={() => { setDisplay(0) }}><h2 className={`profile-navbar ${display == 0 ? "profile-nav-active" : ""}`}>Posts</h2></a>
        <a onClick={() => { setDisplay(1) }}><h2 className={`profile-navbar ${display == 1 ? "profile-nav-active" : ""}`}>Upvotes</h2></a>
        <a onClick={() => { setDisplay(2) }}><h2 className={`profile-navbar ${display == 2 ? "profile-nav-active" : ""}`}>Downvotes</h2></a>
        {display == 1 ? <UpvotesDisplay /> : display == 2 ? <DownvotesDisplay /> : usersThreads.length == 0 ? <p>No posts yet :(</p> : (
        <div>
          <ul>
            {usersThreads.map(thread => (
              <li className="card thread-grid" key={thread._id}>
                <div>
                  <Upvote id={thread._id} />
                </div>
                <div>
                  <div>
                  <Link to={"/forums/" + id + '/thread/' + thread._id}>
                    <h3>{thread.title}</h3>
                  </Link>
                  <p>
                    <span className="link"><Link to={'/forums/' + thread.forumParent._id}> {thread.forumParent.title}</Link></span>
                    {" " + '\u2022'} Posted at {moment(thread.date).format('MMM Do YYYY')}
                    , by <span className="link"><a href={'/profile/' + id}> {userData.name}</a></span>
                  </p>
                </div>
                </div>
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