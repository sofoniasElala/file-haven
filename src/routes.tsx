import { redirect } from "react-router-dom";
import App from "./components/App";
import LoginForm from "./components/LoginForm";
import SignUpFrom from './components/SignUpForm';
import HomePage from "./components/HomePage";
import { checkAuthStatus, setUserLocalStorage } from "./utils";
import Folder from "./components/Folder";
import { DateTime } from "luxon";
import NotFound from "./components/NotFound";

const loggedInUserReRouter = async ({ request }: { request: Request }) => { 
    const url = new URL(request.url);  // Creates a URL object from the request
    const pathname = url.pathname; 
    const userLocalJSON = localStorage.getItem('file-haven-username');
    if(userLocalJSON){
        const userLocal = JSON.parse(userLocalJSON);
        const expiresDateTime = DateTime.fromISO(userLocal.expires);
        if(expiresDateTime.day < DateTime.now().day && expiresDateTime.month == DateTime.now().month && expiresDateTime.year == DateTime.now().year) setUserLocalStorage(false);
        else {
            if(pathname === '/login' || pathname === '/signup') return redirect('/');
            else return null;
        }
    } else {
            if(pathname === '/login' || pathname === '/signup') {
                return null;
            } else {
                const status = await checkAuthStatus();
                if (!status.loggedIn && pathname === '/') return redirect("/login");
            }
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
            },
            {
                path: "folders/:folderId",
                element: <Folder />
            },
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
    {
        path: '*',
        element: <NotFound />,
    }
]

export default routes;