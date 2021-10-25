import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';

import { useSelector } from "react-redux";

function Upvote(props) {
  const [votes, setVotes] = useState("");
  const [voteStatus, setStatus] = useState(0); //upvote status: 0 = neutral, 1 = upvoted, -1 = downvoted. Defaulted to 0
  const [buttonPressed, setPressed] = useState(false);
  const [voteNumber, setNumber] = useState();
  const [initialLoad, setInitialLoad] = useState(true);

  const [threadData, setThreadData] = useState("");
  const [userUpvoteData, setUserUpvoteData] = useState([]);
  const [userDownvoteData, setUserDownvoteData] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [open, openPopup] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const user = useSelector(state => state.user);

  useEffect(() => {
    setLoggedIn(user.userData && user.userData.isAuth)
    let isMounted = true;
    axios.get('/api/threads/' + props.id).then((res) => { //get thread information
      if (isMounted) {
        setVotes(res.data.upvotes);
        setThreadData(res.data);
        axios.get('/api/users/upvotes/' + user.userData._id).then((res) => { //get user's up/downvotes array
          setUserUpvoteData(res.data);
        })
        axios.get('/api/users/downvotes/' + user.userData._id).then((res) => {
          setUserDownvoteData(res.data);
          setLoading(false);
        })
      }
    })
    return () => { isMounted = false };
  }, [])

  useEffect(() => { //setting initial voteStatus for pre-existing votes
    if (initialLoad && threadData) { //check initialLoad so the setting only occurs once
      userUpvoteData.some(el => el._id == threadData._id) ? setStatus(1) :
        userDownvoteData.some(el => el._id == threadData._id) ? setStatus(-1) :
          setStatus(0);
    }
  })

  useEffect(() => { //vote api submission
    if (buttonPressed) { //only make the submission available when the user presses the vote button
      var userVoteData = {
        num: voteNumber,
        newVoteStatus: voteStatus,
        threadID: threadData._id
      }
      axios.patch('/api/threads/upvote/' + props.id, userVoteData);
      axios.patch('/api/users/vote/' + user.userData._id, userVoteData);
      setVotes(votes + voteNumber);
      setPressed(false);
    }
  }, [voteStatus, buttonPressed]);

  const vote = (num) => {
    if (!loggedIn) {
      openPopup(true);
      return;
    }
    if (num == -1) { //if thread is downvoted:
      switch (voteStatus) {
        case 1: //if previously upvoted, downvote by 2 and set status to downvoted
          setNumber(-2);
          setStatus(-1);
          break;
        case -1: //if previously downvoted, upvote by 1 and set status to neutral
          setNumber(1);
          setStatus(0);
          break;
        case 0: //else downvote normally
          setNumber(-1);
          setStatus(-1);
          break;
      }
    } else {
      switch (voteStatus) {
        case 1: //if previously upvoted, downvote by 1 and set status to neutral
          setNumber(-1);
          setStatus(0);
          break;
        case -1: //if previously downvoted, increase vote by 2 and set status to upvoted
          setNumber(2);
          setStatus(1);
          break;
        case 0: //else upvote normally
          setNumber(1);
          setStatus(1);
          break;
      }
    }
    setPressed(true);
    setInitialLoad(false);
  }

  return (
    isLoading ? null : 
    <div className="upvote">
      <a className="upvote-btn" onClick={() => { vote(1) }}><p>{voteStatus != -1 && voteStatus == 1 ? '\uD83E\uDC45' : '\u21E7'}</p></a>
      <p>{votes}</p>
      <a className="upvote-btn" onClick={() => { vote(-1) }}><p>{voteStatus != 1 && voteStatus == -1 ? '\uD83E\uDC47' : '\u21E9'}</p></a>
      <Popup open={open} onClose={() => {openPopup(false)}} modal>
        <div className="container">
          <br />
          <p style={{ textAlign: 'center' }}>You must be logged in to vote threads.</p>
          <a href='/login'><button className='vertical-center btn'>Login</button></a>
        </div>
      </Popup>
    </div>
  );
}

export default Upvote;