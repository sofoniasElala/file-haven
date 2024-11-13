import { getHomePage } from "../utils"
import { useEffect, useState, useRef } from "react"
import { useOutletContext } from "react-router-dom";
import { FileModel, FolderModel } from "../../types/global";
import FileFolderList from "./FileFolderList";


export default function HomePage(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const [folderIdRef, parentRefresh] = useOutletContext<[React.MutableRefObject<Number | null>, boolean]>();

    useEffect(() => {
       async function getFoldersAndFiles(){
        const response = await getHomePage();
        setFoldersAndFiles(response);
       }
       getFoldersAndFiles();
       folderIdRef.current = null;
    }, [refresh, parentRefresh])

    

    return (
        <>
        <p>HOMEPAGE</p>
        <FileFolderList setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}