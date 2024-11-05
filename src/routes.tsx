import { redirect } from "react-router-dom";
import App from "./components/App";
import LoginForm from "./components/LoginForm";
import SignUpFrom from './components/SignUpForm';
import HomePage from "./components/HomePage";
import { checkAuthStatus } from "./utils";

const loggedInUserReRouter = async ({ request }: { request: Request }) => { // destructuring with type annotation
    const url = new URL(request.url);  // Creates a URL object from the request
    const pathname = url.pathname;  
    const status = await checkAuthStatus();
    if (!status.loggedIn && pathname === '/') {
      return redirect("/login");
    } else if(status.loggedIn && (pathname === '/login' || pathname === '/signup')){
      return redirect('/')
    }
    return null;
  };
  
const routes = [
    {
        path: "/",
        element: <App />,
        loader: loggedInUserReRouter,
        children: [
            {
                path: "/",
                element: <HomePage />
            }
        ]
    },
    {
        path: "/login",
        loader: loggedInUserReRouter,
        element: <LoginForm />
    },
    {
        path: "/signup",
        loader: loggedInUserReRouter,
        element: <SignUpFrom />
    },
]

export default routes;