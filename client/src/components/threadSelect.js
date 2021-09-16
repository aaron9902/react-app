import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';

function ThreadSelect() {
  const { forumID } = useParams();
  const { threadID } = useParams(); //getting threadID from url
  const [threadData, setThreadData] = useState([]);
  const [forumData, setForumData] = useState("");

  useEffect(() => { //get thread info
    let isMounted = true;
    axios.get('/api/forums/' + forumID).then((res) => {
      if (isMounted) setForumData(res.data);
    })
    axios.get('/api/threads/' + threadID).then((res) => {
      if (isMounted) setThreadData(res.data);
    });
    return () => { isMounted = false };
  }, [])

  return ( //whiteSpace property allows the display of linebreaks
    <div>
      <Link to={'/forums/' + forumID}>
        <h1>{forumData.title}</h1>
      </Link>
      <h2>{threadData.title}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{threadData.desc}</p>
      <p>{threadData.date} by: Username</p>
      <div>
        <textarea
          placeholder="What are your thoughts?"
          maxLength="300"
          rows={5}
          style={{ width: "500px" }}
        />
        <br />
        <button>Comment</button>
      </div>
      <p>Comments go here</p>
    </div>
  );
}

export default withRouter(ThreadSelect);