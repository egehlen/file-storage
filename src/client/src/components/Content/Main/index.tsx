import MainProps from "interfaces/props/mainProps";

import './index.css';

function Main(props: MainProps) {

    return (
        <div className='main'>
            {props.children}
        </div>
    );
}

export default Main;