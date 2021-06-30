import { useState,useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailRefInput = useRef()
  const passwordRefInput = useRef()
  const history = useHistory();
  const authCtx = useContext(AuthContext)
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading,setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (e) =>{
    e.preventDefault()

    const enteredEmail = emailRefInput.current.value;
    const enteredPassword = passwordRefInput.current.value;

    setIsLoading(true);
    let url;
    if(isLogin){
       url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDi9zCFWKbaUdI0MVcASOs60n8DcF-K6Ak';
    }
    else
    {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDi9zCFWKbaUdI0MVcASOs60n8DcF-K6Ak';
    }

    fetch(url,
      {
        method:'POST',
        body: JSON.stringify({
          email:enteredEmail,
          password:enteredPassword,
          returnSecureToken:true
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }
     )
     .then(res=>{
       setIsLoading(false)
       if(res.ok)
       {
          return res.json()
       }
       else{
         return res.json().then(data=>
         {
           let errorMessage = 'Authentication Failed';
           if(data && data.error && data.error.message)
           {
               errorMessage = data.error.message;
           }
          
           throw new Error(errorMessage)
         })
       }
     })
     .then(data => { 
       authCtx.login(data.idToken)
       history.replace('/');
     }).catch(err=>{
      alert(err.message)
     })
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailRefInput} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordRefInput} type='password' id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending Request</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
