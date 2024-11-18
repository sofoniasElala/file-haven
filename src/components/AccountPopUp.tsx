import accountCircleIcon from '/account_circle.svg';
import logoutIcon from '/logout.svg';
import deleteIcon from '/delete_account.svg';
import { logOut, deleteAccount, notificationPopUp } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

export default function AccountPopUp({open, setOpen}: {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>}){
    const username = JSON.parse(localStorage.getItem('file-haven-username')!).username;
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const deleteDialogRef = useRef<HTMLDialogElement | null>(null);

    async function handleClick(type: string){
        let apiCall;
        let message: {success: string, pending: string} = {success: '', pending: ''}
        if(type === 'logout'){
            apiCall = logOut();
            message.success = 'Log out successful';
            message.pending = 'Logging out...';
         } else if(type == 'delete') {
            apiCall = deleteAccount();
            message.success = 'Account deleted';
            message.pending = 'Deleting account...'
         } else {
            deleteDialogRef.current!.close();
            setConfirmOpen((prev) => !prev);
            setOpen((prev) => !prev);
         }
         if(type !== 'cancel'){
            const response = await notificationPopUp(
                apiCall!,
            { pending: message.pending, success: message.success},
            2000
            );
            if(response.success) navigate('/login');
         }

    }
    return (
        <>
            <div  id="overlay"  className="account-overlay" style={{display: open && !confirmOpen  ? "block" : "none"}} onClick={() => setOpen((prev) => !prev)}></div>
            <dialog ref={deleteDialogRef} className="delete-account-dialog" >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleClick('delete');
                    setConfirmOpen((prev) => !prev);
                    setOpen((prev) => !prev);
                    deleteDialogRef.current!.close();
                    }}>
                    <div>Confirm deletion of account and all related data</div>
                    <hr />
                    <div className="deletion-warning">
                        This action cannot be undone
                    </div>
                    <hr />
                    <div className="account-buttons">
                        <button type='button' onClick={()=> handleClick('cancel')}>Cancel</button>
                        <button type='submit'>Delete</button>
                    </div>
                </form>
            </dialog>
            <div className="account-pop-up"  style={{ display: open && !confirmOpen ? "block" : "none", top: `190px`, left: `1180px`}}>
                <div className="profile">
                    <img src={accountCircleIcon} height='45px' alt="profile image" />
                    <div className='username'>{username}</div>
                </div>
                <hr />
                <div className="account-buttons">
                    <button className="delete-account" disabled={username == 'demo' ? true : false} style={{cursor: username == 'demo' ? 'text' : 'pointer'}} onClick={() => {deleteDialogRef.current?.showModal(); setConfirmOpen((prev) => !prev);}}><img src={deleteIcon} height='25px' alt="delete account" />Delete account</button>
                    <button className="logout" onClick={() => handleClick('logout')}><img src={logoutIcon} height='25px' alt="logout" />Log out</button>
                </div>
            </div>
        </>
    )
}