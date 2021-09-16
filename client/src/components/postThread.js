import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';

import { useDispatch } from 'react-redux';

function PostThread() {
  const { id } = useParams();

  const [forumData, setForumData] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadDesc, setThreadDesc] = useState("");
  const [username, setUsername] = useState("")
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/forums/' + id).then((res) => {
      if (isMounted) setForumData(res.data);
    });
    //get username from auth payload, set it to username
  }, []);

  const post = () => {
    var data = {
      title: threadTitle,
      desc: threadDesc,
      forumParent: id
      //userParent: username //set userParent to fetched username
    };
    axios.post('/api/threads', data).then((res) => {
      setPosted(true);
      console.log(res);
    })
  }

  return (
    <div>
      <h1>{forumData.title}</h1>
      <p>{forumData.desc}</p>
      {posted ? (
        <div>
          <p>Thread posted!</p>
          <Link to={'/forums/' + id}>Back to {forumData.title}</Link>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Title"
            value={threadTitle}
            onChange={e => setThreadTitle(e.target.value)}
            required
            style={{ width: "500px" }}
          />
          <br /><br />
          <textarea
            placeholder="Description"
            value={threadDesc}
            onChange={e => setThreadDesc(e.target.value)}
            required
            rows={10}
            maxLength="300"
            style={{ width: "500px" }}
          />
          <br />
          <button onClick={post}>Post</button>
          <Link to={'/forums/' + id}>
            <button>Cancel</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default withRouter(PostThread);