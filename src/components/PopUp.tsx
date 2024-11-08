export default function PopUp({id, clickedElementRef, setFileOrFolderId}: {id: number, clickedElementRef: React.MutableRefObject<Element | null>, setFileOrFolderId: React.Dispatch<React.SetStateAction<number>>}){
    const rect = clickedElementRef.current?.getBoundingClientRect();
    const top = rect?.top;

    return (
        <>
        <div id="overlay" className="overlay" style={{display: id < 0 ? "none" : "block"}} onClick={() => setFileOrFolderId(-1)}></div>
            <div className="pop-up" style={{ display: id < 0 ? "none" : "block", top: `${top! + 90}px` }}>
                <div className="rename">{"Rename"}</div>
                <div className="download">{"Download"}</div>
                <div className="delete">{"Delete"}</div>
        </div>
        </>
    )
}