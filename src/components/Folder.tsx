import { useEffect, useRef, useState } from "react";
import { FolderModel, FileModel } from "../../types/global";
import { getFolder } from "../utils";
import { useOutletContext, useParams } from "react-router-dom";
import FileFolderList from "./FileFolderList";

export default function Folder(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });
    const [fileOrFolder, setFileOrFolder] = useState<{type: string, name: string, id: number}>({type: '', name: '', id: -1});
    const clickedElementRef = useRef<HTMLImageElement | null>(null); // null is required bc otherwise .current will be read only
    const [refresh, setRefresh] = useState(false); //toggle state to re-render after renames and deletes
    const parentRefresh = useOutletContext();
    const {folderId} = useParams();
    useEffect(() => {
        async function getFoldersAndFiles(){
         const response = await getFolder(Number(folderId));
         setFoldersAndFiles(response);
        }
        getFoldersAndFiles();
     }, [refresh, parentRefresh])

    return (
        <>
            <p>{"FOLDER"}</p>
            <FileFolderList setRefresh={setRefresh} fileOrFolder={fileOrFolder} foldersAndFiles={foldersAndFiles} clickedElementRef={clickedElementRef} setFileOrFolder={setFileOrFolder} />
        </>
        
    )
}