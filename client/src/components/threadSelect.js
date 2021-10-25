import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import axios from 'axios';
import moment from 'moment';
import Popup from 'reactjs-popup';

function ThreadSelect() {
  const { threadID } = useParams(); //getting threadID from url
  const [threadData, setThreadData] = useState("");
  const [reportDesc, setReportDesc] = useState("");

  useEffect(() => { //get thread info
    let isMounted = true;
    axios.get('/api/threads/' + threadID).then((res) => {
      if (isMounted) setThreadData(res.data);
    });
    return () => { isMounted = false };
  }, [])

  console.log(threadData);

// Create a report ticket
  const post = () => {
    var data = {
      desc: reportDesc,
      reportedThread: threadID
    };
    axios.post('/api/reports', data).then((res) => {
      console.log(res);
    })
  }

  return (
    threadData == "" ? null : ( //wait for threadData to be fetched
      <div className="container">
        <Link to={'/forums/' + threadData.forumParent._id}>
          <h1>{threadData.forumParent.title}</h1>
        </Link>
        <h2>{threadData.title}</h2>
        <p style={{ whiteSpace: 'pre-line' }}>{threadData.desc}</p>
        <p>Posted at {moment(threadData.date).format('MMM Do YYYY')}
          , by <span className="link"><Link to={'/profile/' + threadData.userParent._id}> {threadData.userParent.name}</Link></span>
        </p>
        <div>
          <textarea
            placeholder="What are your thoughts?"
            maxLength="300"
            rows={5}
            style={{ width: "500px" }}
          />
          <br />
          <button className="btn">Comment</button>
          <Popup trigger={<button className='btn btn-danger'>Report</button>} modal>
            <div className="container">
              <br />
              <h1 className='text-center'>Report Thread</h1>
              <h2>Reason:</h2>
              <form onSubmit={post} action={"/forums/" + threadData.forumParent._id + "/thread/" + threadID}>
                <textarea
                  placeholder="Why are you reporting this thread?"
                  defaultValue={''}
                  onChange={e => setReportDesc(e.target.value)}
                  required
                  rows={8}
                  maxLength="300"
                  style={{ width: "100%", whiteSpace: "pre-line" }}
                />
                <button className=" vertical-center btn btn-danger" type="submit" style={{ marginTop: 10 }}>Send Report</button>
              </form>
            </div>
          </Popup>
        </div>
        <p>Comments go here</p>
      </div>
    )
  );
}

export default withRouter(ThreadSelect);