import React, { useState } from 'react'
//import Axios from 'axios';
import { useDispatch } from 'react-redux'
import { loginUser } from '../_actions/user_action'
import { withRouter } from 'react-router-dom'

function LoginPage(props) {
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let body = {
      email: Email,
      password: Password
    }
    dispatch(loginUser(body))
      .then(response => {
        if (response.payload.loginSuccess) {
          props.history.push('/')
        } else {
          setIncorrectLogin(true);
        }
      })
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '75vh' }}>
      <form
        style={{ display: 'flex', flexDirection: 'column' }}
        onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <button className="btn-primary"> Login </button>
        {incorrectLogin ? (
          <div>
            <br/>
            <p style={{color:'red', textAlign:'center'}}>Incorrect email or password</p>
          </div>
        ) : null}
      </form>
    </div>
  )
}
export default withRouter(LoginPage);
