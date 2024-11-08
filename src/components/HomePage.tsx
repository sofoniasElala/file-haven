import { getHomePage } from "../utils"
import { useEffect, useState, useRef } from "react"
import { FileModel, FolderModel } from "../../types/global";
import { DateTime } from "luxon";
import PopUp from "./PopUp";
import options from '/ellipsis-vertical-solid-2.svg';
import '../styles/Homepage.css'


export default function HomePage(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });
    const [fileOrFolderId, setFileOrFolderId] = useState<number>(-1);
    const clickedElementRef = useRef<Element | null>(null); // null is required bc otherwise current will be read only

    useEffect(() => {
       async function getFoldersAndFiles(){
        const response = await getHomePage();
        console.log(response)
        setFoldersAndFiles(response);
       }
       getFoldersAndFiles();
    }, [])

    function handleClick(id: number, element: Element){
        setFileOrFolderId(id);
        clickedElementRef.current = element;
    }

    return (
        <>
        <p>HOMEPAGE</p>
        <section className="container">
            <div className="column-labels">
                <div className="name-column">{"Name"}</div>
                <div className="last-modified-column">{"Last modified"}</div>
                <div className="file-size-column">{"File size"}</div>
            </div>
            <div className="column-data">
                {foldersAndFiles.folders.map(folder => {
                    return <><div key={folder.id} className={`${folder.id} folder`}>
                            <div className="name">{folder.name}</div>
                            <div className="last-modified">{DateTime.fromISO(folder.updatedAt).toFormat(
                            "MMMM dd, yyyy"
                        )}</div>
                            <div className="size">{"—"}</div>
                            <img src={options} height='20px' alt="more action" onClick={(event) => handleClick(folder.id, event.currentTarget)} />
                        </div>
                        <hr />
                        </>
                })}
                {foldersAndFiles.files.map(file => {
                    return <><div key={file.id} className="file">
                        <div className="name">{file.name}</div>
                        <div className="last-modified">{DateTime.fromISO(file.updatedAt).toFormat(
                        "MMMM dd, yyyy"
                    )}</div>
                        <div className="size">{file.size}</div>
                        <img src={options} height='20px' alt="more action" onClick={(event) => handleClick(file.id, event.currentTarget)} />
                    </div>
                    <hr />
                    </>
                })}
            </div>
        </section>
        <PopUp id={fileOrFolderId} clickedElementRef={clickedElementRef} setFileOrFolderId={setFileOrFolderId} />
        </>
        
    )
}