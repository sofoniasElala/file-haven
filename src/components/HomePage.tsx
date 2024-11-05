import { getHomePage } from "../utils"
import { useEffect, useState } from "react"
export default function HomePage(){
    const [foldersAndFiles, setFoldersAndFiles] = useState(null);

    useEffect(() => {
       async function getFoldersAndFiles(){
        const response = await getHomePage();
        console.log(response)
        setFoldersAndFiles(response);
       }
       getFoldersAndFiles();
    }, [])
    return (
        <p>HOMEPAGE</p>
    )
}