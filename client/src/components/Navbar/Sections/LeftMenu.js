import React from 'react';
import { Menu } from 'antd';
import { useSelector } from "react-redux";

function LeftMenu(props) {
  const user = useSelector(state => state.user)

  return (
    <Menu mode={props.mode}>
      <Menu.Item>
        <a href="/">Home</a>
      </Menu.Item>
      {user.userData && user.userData.isAuth ? (
        <Menu.Item>
          <a href={"/profile/" + user.userData._id}>Profile</a>
        </Menu.Item>
      ) : null}
      {user.userData && user.userData.isAuth && user.userData.role == 1 ? (
        <Menu.Item>
          <a href={"/usermanagement"}>User Management</a>
        </Menu.Item>
      ) : null}
    </Menu>
  )
}

export default LeftMenu