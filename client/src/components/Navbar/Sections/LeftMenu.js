import React from 'react';
import { useSelector } from "react-redux";

function LeftMenu(props) {
  const user = useSelector(state => state.user)

  return (
    <div className="navbar">
      <a href="/">Home</a>
      {user.userData && user.userData.isAuth ? (
        <a href={"/profile/" + user.userData._id}>Profile</a>
      ) : null}
      {user.userData && user.userData.isAuth && user.userData.role == 1 ? (
          <a href={"/usermanagement"}>User Management</a>
      ) : null}
      {user.userData && user.userData.isAuth && (user.userData.role == 1 || user.userData.role == 2) ? (
          <a href={"/reportmanagement"}>Report Management</a>
      ) : null}
    </div>
  )
}

export default LeftMenu