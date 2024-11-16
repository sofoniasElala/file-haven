import { createRoot } from 'react-dom/client'
import routes from './routes'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'
import { Slide, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter(routes)
createRoot(document.getElementById('root')!).render( 
  <>
    <ToastContainer position='top-center' transition={Slide} theme='dark'/>
   <RouterProvider router={router}/>
  </> 
)
