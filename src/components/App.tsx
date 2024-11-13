import '../styles/App.css'
import { useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AsideColumn from './AsideColumn'

function App() {
  const folderIdRef = useRef<number | null>(null);
  const [parentRefresh, setParentRefresh] = useState(false); //toggle state to re-render after file upload and folder creation
  return (
    <>
    <main>
      <aside>
        <AsideColumn setParentRefresh={setParentRefresh} folderIdRef={folderIdRef}/>
      </aside>
      <section className="container">
        <Outlet context={[folderIdRef, parentRefresh]} /> 
      </section>
    </main>
    <footer>Copyright © <span id="date"></span> SofoniasElala  <a href="https://github.com/sofoniasElala/file-haven"><i className="fa-brands fa-github" style={{color: "#000000"}}></i></a></footer>
    </>
  )
}

export default App
