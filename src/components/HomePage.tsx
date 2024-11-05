import { getHomePage } from "../utils"
import { useEffect, useState } from "react"
import { FileModel, FolderModel } from "../../types/global";
import { DateTime } from "luxon";

export default function HomePage(){
    const [foldersAndFiles, setFoldersAndFiles] = useState<{id: number, username: string, folders: FolderModel[], files: FileModel[]}>({id: 0, username: '', folders: [], files: [] });

    useEffect(() => {
       async function getFoldersAndFiles(){
        const response = await getHomePage();
        console.log(response)
        setFoldersAndFiles(response);
       }
       getFoldersAndFiles();
    }, [])

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
                    </div>
                    <hr />
                    </>
                })}
            </div>
        </section>
        </>
        
    )
}