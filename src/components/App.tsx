import '../styles/App.css'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    <nav>
      <p onClick={()=> console.log('project name clicked')} >File Haven</p>
      <hr />
    </nav>
    <main>
      <Outlet /> 
    </main>
    <footer>Copyright © <span id="date"></span> SofoniasElala  <a href="https://github.com/sofoniasElala/file-haven"><i className="fa-brands fa-github" style={{color: "#000000"}}></i></a></footer>
    </>
  )
}

export default App
