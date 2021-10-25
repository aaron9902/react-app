import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Upvote from './Upvote'
import { useSelector } from "react-redux";
import Popup from 'reactjs-popup';

function ForumSelect() {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const { id } = useParams(); //get forum id from the url i.e. localhost:3000/forums/:id (see the route declared in App.js)
  const [threadData, setThreadData] = useState([]);
  const [forumData, setForumData] = useState("");
  const [searchName, setSearchName] = useState(""); //store inputs from the search bar

  const user = useSelector(state => state.user);
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, openPopup] = useState(false);

  const [display, setDisplay] = useState(0); //0 = newest (default), 1 = oldest, 2 = most upvotes, 3 = least upvotes

  useEffect(() => {
    setLoggedIn(user.userData && user.userData.isAuth)
    let isMounted = true;
    axios.get('/api/forums/' + id).then((res) => {
      if (isMounted) {
        setForumData(res.data);
        axios.get('/api/forums/' + id + '/threads').then((res) => {
          setThreadData(res.data);
          setLoading(false);
        });
      }
    })
      .catch((error) => {
        setError(true);
      })
    return () => { isMounted = false };
  }, [])

  useEffect(() => {
    document.title = !forumData.title ? document.title : forumData.title;
  })

  const find = () => { //function that calls backend thread search by name
    if (searchName && searchName.trim()) {
      axios.get('/api/threads/' + id + '/' + searchName).then((res) => {
        setThreadData(res.data);
      });
    } else {
      axios.get('/api/forums/' + id + '/threads').then((res) => {
        setThreadData(res.data);
      });
    }
  }

  const findByDate = (num) => {
    if (searchName) {
      axios.get('/api/threads/sort/date/' + id + '/' + num + '/' + searchName).then((res) => {
        setThreadData(res.data);
      })
    } else {
      axios.get('/api/threads/sort/date/' + id + '/' + num).then((res) => {
        setThreadData(res.data);
      })
    }
  }

  const findByUpvotes = (num) => {
    if (searchName) {
      axios.get('/api/threads/sort/upvotes/' + id + '/' + num + '/' + searchName).then((res) => {
        setThreadData(res.data);
      })
    } else {
      axios.get('/api/threads/sort/upvotes/' + id + '/' + num).then((res) => {
        setThreadData(res.data);
      })
    }
  }

  const ConditionalLink = ({ to, condition }) => (!!condition && to)
    ? <Link to={"/forums/" + id + "/post"}>Post a thread</Link>
    : <a onClick={() => { openPopup(true) }}>Post a thread</a>;

  return ( //display forum that was clicked on and its threads
    isError ? <p>Forum not found</p> : isLoading ? null :
      <div className="container">
        <h1>{forumData.title}</h1>
        <p>{forumData.desc}</p>
        <ConditionalLink to={"/forums/" + id + "/post"} condition={loggedIn} />
        <Popup open={open} onClose={() => { openPopup(false) }} modal>
          <div className="container">
            <br />
            <p style={{ textAlign: 'center' }}>You must be logged in to post threads.</p>
            <a href='/login'><button className='vertical-center btn'>Login</button></a>
          </div>
        </Popup>
        <div className="flex">
          <input
            type="text"
            placeholder="Search thread name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)} //constantly updates searchName to whatever is being tpyed in
          />
          <button className="search-bar btn-primary" type="button" onClick={find}>Search</button>
        </div>

        <div>
          <a onClick={() => { setDisplay(0); findByDate(-1) }}><p className={`profile-navbar ${display == 0 ? "profile-nav-active" : ""}`}>Newest</p></a>
          <a onClick={() => { setDisplay(1); findByDate(1) }}><p className={`profile-navbar ${display == 1 ? "profile-nav-active" : ""}`}>Oldest</p></a>
          <a onClick={() => { setDisplay(2); findByUpvotes(-1) }}><p className={`profile-navbar ${display == 2 ? "profile-nav-active" : ""}`}>Top</p></a>
          <a onClick={() => { setDisplay(3); findByUpvotes(1) }}><p className={`profile-navbar ${display == 3 ? "profile-nav-active" : ""}`}>Bottom</p></a>
        </div>

        {threadData == "" ? <p>No threads found</p> :
          <ul>
            {threadData.map(thread => (
              <li key={thread._id} className='card thread-grid'>
                <div>
                  <Upvote id={thread._id} />
                </div>
                <div>
                  <Link to={"/forums/" + id + '/thread/' + thread._id}>
                    <h3>{thread.title}</h3>
                  </Link>
                  <p>Posted at {moment(thread.date).format('MMM Do YYYY')}
                    , by <span className="link"><Link to={'/profile/' + thread.userParent._id}> {thread.userParent.name}</Link></span>
                  </p>
                </div>
              </li>
            ))}
          </ul>}
      </div>
  );
}

export default withRouter(ForumSelect);