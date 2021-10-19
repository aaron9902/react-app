import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Upvote(props) {
  const [votes, setVotes] = useState("");

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/threads/' + props.id).then((res) => {
      if (isMounted) {
        setVotes(res.data.upvotes);
      }
    })
    return () => { isMounted = false };
  }, [])

  const vote = (num) => {
    var data = {
      num: num
    };
    axios.patch('/api/threads/upvote/' + props.id, data);
    setVotes(votes + num);
  }

  return (
    <div className="upvote">
      <a className="upvote-btn" onClick={() => { vote(1) }}><p>{'\u2B06'}</p></a>
      <p>{votes}</p>
      <a className="upvote-btn" onClick={() => { vote(-1) }}><p>{'\u2B07'}</p></a>
    </div>
  );
}

export default Upvote;