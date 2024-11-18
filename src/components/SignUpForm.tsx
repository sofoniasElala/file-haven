import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { notificationPopUp, signUpForAccount } from "../utils";

export default function SignUpForm() { 
    const [inputs, setInputs] = useState<{username: string, password: string, passwordConfirmation: String, errorMessage?:string}>({username: '', password: '', passwordConfirmation: ''})
    const navigate = useNavigate();
    document.title = `Sign up - File Haven`
    
    async function handleSubmission(signUpFormData: FormData){
        const signUpData: any = {
            username: signUpFormData.get("username"),
            password: signUpFormData.get("password"),
            passwordConfirmation: signUpFormData.get("passwordConfirmation")
          };
        const signUpApiCall = signUpForAccount(signUpData);
        const response = await notificationPopUp(
          signUpApiCall,
          { pending: `Creating account...`, success: `Account created`},
          2000
          );
        if(response.success){
            navigate('/login')
        } else {
             signUpData.errorMessage = response.errors;
             setInputs(signUpData);
        }
    }
    
    
    return (
        <main className="form-main">
          <p id="form-paragraph">
            Sign up
          </p>
        <form
          id="account"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmission(new FormData(e.currentTarget));
          }}
        >
          <div className="username">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              required
            />
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          <div className="confirm-password">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirmation"
              id="confirm-password"
              required
            />
          </div>
          {inputs.username.length > 0 && <p className="error">{inputs.errorMessage}</p>}
          <button type="submit">Sign up</button>
        </form>
        <p>Have an account? <Link to='/login'>Log in</Link></p>
        <h1 className="background-title"><em><Link to='/' >File Haven</Link></em></h1>
        </main>
      );

}