import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Upvote from './Upvote'

function ForumSelect() {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const { id } = useParams(); //get forum id from the url i.e. localhost:3000/forums/:id (see the route declared in App.js)
  const [threadData, setThreadData] = useState([]);
  const [forumData, setForumData] = useState("");
  const [searchName, setSearchName] = useState(""); //store inputs from the search bar

  useEffect(() => {
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
    axios.get('/api/threads/' + id + '/' + searchName).then((res) => {
      setThreadData(res.data);
    });
  }

  return ( //display forum that was clicked on and its threads
    isError ? <p>Forum not found</p> : isLoading ? null :
      <div className="container">
        <h1>{forumData.title}</h1>
        <p>{forumData.desc}</p>
        <Link to={"/forums/" + id + "/post"}>
          <p>Post a thread</p>
        </Link>
        <div className="flex">
          <input
            type="text"
            placeholder="Search thread name"
            value={searchName}
            onChange={e => setSearchName(e.target.value)} //constantly updates searchName to whatever is being tpyed in
          />
          <button className="search-bar btn-primary" type="button" onClick={find}>Search</button>
        </div>
        {threadData == "" ? <p>No threads found</p> :
          <ul>
            {threadData.map(thread => (
              <li key={thread._id} className='card thread-grid'>
                <div>
                  <Upvote id={thread._id}/>
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