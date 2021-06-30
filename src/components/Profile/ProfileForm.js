import {useRef,useContext} from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const submitHandler = (event) =>{
    event.preventDefault();

    const enteredPassword = newPasswordInputRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDi9zCFWKbaUdI0MVcASOs60n8DcF-K6Ak',
    {
      method:'post',
      body:JSON.stringify({
        idToken:authCtx.token,
        password:enteredPassword,
        returnSecureToken:false
      }),
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(res=>{
        history.replace('/')
    })
    
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
