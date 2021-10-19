import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';

import { useSelector } from "react-redux";

function PostThread() {
  const user = useSelector(state => state.user)
  const { id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  const [forumData, setForumData] = useState("");
  const [threadTitle, setThreadTitle] = useState("");
  const [threadDesc, setThreadDesc] = useState("");

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/forums/' + id).then((res) => {
      if (isMounted) setForumData(res.data);
      setLoading(false);
    })
    .catch((error) => {
      setError(true);
    })
    return () => { isMounted = false };
  }, []);

  useEffect(()=> {
    document.title = !forumData.title ? document.title : "Post in " + forumData.title;
  })

  const post = () => {
    var data = {
      title: threadTitle,
      desc: threadDesc,
      forumParent: id,
      userParent: user.userData._id
    };
    axios.post('/api/threads', data).then((res) => {
      console.log(res);
    })
  }

  return (
    isError ? <p>Thread not found</p> : user.userData && !user.userData.name || isLoading ? null : ( //waits for forumData to be fetched before rendering the page (static elements were rendered immediately)
      <div className="container">
        <h1>{forumData.title}</h1>
        <p>{forumData.desc}</p>
        <div>
          <form onSubmit={post} action={"/forums/" + id}>
            <input
              type="text"
              placeholder="Title"
              value={threadTitle}
              onChange={e => setThreadTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={threadDesc}
              onChange={e => setThreadDesc(e.target.value)}
              required
              rows={10}
              maxLength="300"
            />
            <div className="vertical-center" style={{ marginTop: 15 }}>
              <button className="btn" type="submit">Post</button>
              <Link to={'/forums/' + id}>
                <button className="btn" style={{ marginLeft: '10px' }}>Cancel</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default withRouter(PostThread);