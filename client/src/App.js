import './App.css';
import { BrowserRouter as Router,Switch,Route} from "react-router-dom";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth'
  


//Route Options
    //null    =>  everyone can access this page (landing page and About page)
    //true    =>  logged in users can access this page ()
    //false   =>  logged in users CANNOT access this page (register and login page)
function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null )  } />
          <Route exact path="/login" component={Auth(LoginPage, false) } />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
        </Switch>
      </div>
    </Router>
  );
}


export default App;
