import React from 'react';
import './Alert.css'
const AlertClass = ({type,message}) => {
    return (<>  
    <div className="toast-panel">
    
        {type === 'help'&&<div className="toast-item help">
            <div className="toast help">
                <label htmlFor="t-help" className="close"></label>
                <h3>Help!</h3>
                <p>{message}</p>
            </div>
        </div>}
        {type === 'success'&&<div className="toast-item success">
            <div className="toast success">
                <label htmlFor="t-success" className="close"></label>
                <h3>Success!</h3>
                <p>{message}</p>
            </div>
        </div>}
        {type === 'warning'&&<div className="toast-item warning">
            <div className="toast warning">
                <label htmlFor="t-warning" className="close"></label>
                <h3>Warning!</h3>
                <p>{message}</p>
            </div>
        </div>}
        {type === 'error'&&<div className="toast-item error">
            <div className="toast error">
                <label htmlFor="t-error" className="close"></label>
                <h3>Error!</h3>
                <p>{message}</p>
            </div>
        </div>}
    
        {/* <div className="toast-icons">
            <label htmlFor="t-help" className="toast-icon icon-help"></label>
            <label htmlFor="t-success"  className="toast-icon icon-success"></label>
            <label htmlFor="t-warning"  className="toast-icon icon-warning"></label>
            <label htmlFor="t-error" className="toast-icon icon-error"></label>
        </div> */}
    
    </div>
    </>);
};
export default AlertClass;