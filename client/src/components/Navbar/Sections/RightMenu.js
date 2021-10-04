/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <div className="navbar">
        <a href="/login">Signin</a>
        <a href="/register">Signup</a>
      </div>
    )
  } else {
    return (
      <div className="navbar">
        <a onClick={logoutHandler}>Logout</a>
      </div>

    )
  }
}

export default withRouter(RightMenu);