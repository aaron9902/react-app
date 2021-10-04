import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';

function ForumSelect() {
  const { id } = useParams(); //get forum id from the url i.e. localhost:3000/forums/:id (see the route declared in App.js)
  const [threadData, setThreadData] = useState([]);
  const [forumData, setForumData] = useState("");
  const [searchName, setSearchName] = useState(""); //store inputs from the search bar

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/forums/' + id).then((res) => {
      if (isMounted) setForumData(res.data);
    });
    axios.get('/api/forums/' + id + '/threads').then((res) => {
      if (isMounted) {
        setThreadData(res.data);
      }
    });
    return () => { isMounted = false };
  }, [])

  const find = () => { //function that calls backend thread search by name
    axios.get('/api/threads/' + id + '/' + searchName).then((res) => {
      setThreadData(res.data);
    });
  }

  return ( //display forum that was clicked on and its threads
    forumData == "" ? null : (
      <div>
        <h1>{forumData.title}</h1>
        <p>{forumData.desc}</p>
        <Link to={"/forums/" + id + "/post"}>
          <p>Post a thread</p>
        </Link>
        <input
          type="text"
          placeholder="Search thread name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)} //constantly updates searchName to whatever is being tpyed in
        />
        <button type="button" onClick={find}>Search</button>
        <ul>
          {threadData.length == 0 ? <p>No posts yet. Be the first!</p> : null}
          {threadData.map(thread => ( 
            <li key={thread._id}>
              <Link to={"/forums/" + id + '/thread/' + thread._id}>
                <h3>{thread.title}</h3>
              </Link>
              <p>Posted at {moment(thread.date).format('MMM Do YYYY')}
                , by <Link to={'/profile/' + thread.userParent._id}> {thread.userParent.name}</Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    )
  );
}

export default withRouter(ForumSelect);