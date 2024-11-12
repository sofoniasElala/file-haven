import '../styles/App.css'
import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AsideColumn from './AsideColumn'

function App() {
  const folderId = useRef<number | null>(null);
  const [parentRefresh, setParentRefresh] = useState(false); //toggle state to re-render after file upload and folder creation
  return (
    <>
    <nav>
      <p onClick={()=> console.log('project name clicked')} >File Haven</p>
      <hr />
    </nav>
    <main>
      <aside>
        <AsideColumn setParentRefresh={setParentRefresh} folderId={folderId}/>
      </aside>
      <section className="container">
        <Outlet context={parentRefresh} /> 
      </section>
    </main>
    <footer>Copyright © <span id="date"></span> SofoniasElala  <a href="https://github.com/sofoniasElala/file-haven"><i className="fa-brands fa-github" style={{color: "#000000"}}></i></a></footer>
    </>
  )
}

export default App
