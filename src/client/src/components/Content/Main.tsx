import IMainProps from "interfaces/props/IMainProps";

import './Main.css';

function Main(props: IMainProps) {

    return (
        <div className='main'>
            {props.children}
        </div>
    );
}

export default Main;