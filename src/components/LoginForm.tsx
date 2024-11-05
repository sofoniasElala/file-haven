import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleLogin } from "../utils";

export default function LoginForm() { 
    const [inputs, setInputs] = useState<{username: string, password: string, errorMessage?:string}>({username: '', password: ''})
    const navigate = useNavigate();
    
    async function handleSubmission(loginFormData: FormData){
        const loginData: any = {
            username: loginFormData.get("username"),
            password: loginFormData.get("password")
          };
        const logInApiCall = await handleLogin(loginData);
        if(logInApiCall.success){
            navigate('/')
        } else {
             loginData.errorMessage = logInApiCall.errors;
             setInputs(loginData);
        }
    }
    
    return (
    <main className="form-main">
      <p id="form-paragraph">
        {"Log in"}
      </p>
    <form
      id="account"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmission(new FormData(e.currentTarget));
      }}
    >
      <div className="username">
        <label htmlFor="username"> {"Username "} </label>
        <input
          type="text"
          name="username"
          id="username"
          defaultValue={(inputs && inputs.username) || 'demo'}
          required
        />
      </div>
      <div className="password">
        <label htmlFor="password">{"Password "}</label>
        <input
          type="password"
          name="password"
          id="password"
          defaultValue={(inputs && inputs.password) || 'demoPassword'}
          required
        />
      </div>
      {inputs && <p className="error">{inputs.errorMessage}</p>}
      <button type="submit">Log in</button>
    </form>
    <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
    <h1 className="background-title"><em><Link to='/' >File Haven</Link></em></h1>
    </main>
  );

}