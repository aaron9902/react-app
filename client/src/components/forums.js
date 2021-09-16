import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { BrowserRouter as Router, Link } from "react-router-dom"; //for some reason you have to import Router for the links to work, even though its never used
import axios from 'axios';

function Forums() {
  const [forumData, setForumData] = useState([]); //forumData is where we'll store the forums we fetch. setForumData is a set method in use states
  const [searchName, setSearchName] = useState(""); //store inputs from the search bar

  useEffect(() => {
    let isMounted = true; //some mandatory cleanup toggle to prevent memory leaks
    axios.get('/api/forums').then((res) => { //call backend server '/forums' endpoint
      if (isMounted) setForumData(res.data); //set the resulting data into forumData
    })
    return () => { isMounted = false };
  }, []);

  const find = () => {
    axios.get('/api/forums/name_search/' + searchName).then((res) => {
      setForumData(res.data);
    });
  }

  return (
    <div>
      <h1>Forums</h1>
      <input
        type="text"
        placeholder="Search forum name"
        value={searchName}
        onChange={e => setSearchName(e.target.value)} //constantly updates searchName to whatever is being tpyed in
      />
      <button type="button" onClick={find}>Search</button>
      <ul>
        {forumData.map(forum => ( //loops through forumData. for each forum, display it as link and show its title/desc
          <li key={forum._id}>
            <Link to={"/forums/" + forum._id}>
              <h2>{forum.title}</h2>
              <p>{forum.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default withRouter(Forums);