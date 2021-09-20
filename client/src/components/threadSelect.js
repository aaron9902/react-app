import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';

function ThreadSelect() {
  const { threadID } = useParams(); //getting threadID from url
  const [threadData, setThreadData] = useState("");

  useEffect(() => { //get thread info
    let isMounted = true;
    axios.get('/api/threads/' + threadID).then((res) => {
      if (isMounted) setThreadData(res.data);
    });
    return () => { isMounted = false };
  }, [])

  console.log(threadData);

  return (
    threadData == "" ? null : ( //wait for threadData to be fetched
      <div>
        <Link to={'/forums/' + threadData.forumParent._id}>
          <h1>{threadData.forumParent.title}</h1>
        </Link>
        <h2>{threadData.title}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{threadData.desc}</p>
        <p>Posted at {moment(threadData.date).format('MMM Do YYYY')}
          , by <Link to={'/profile/' + threadData.userParent._id}> {threadData.userParent.name}</Link>
        </p>
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
    )
  );
}

export default withRouter(ThreadSelect);