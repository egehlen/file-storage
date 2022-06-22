import { PoweroffOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

import './index.css';

function UserInfo() {
    return (
        <div className='user-info'>
            <div className='wallet-address'>
                <Tooltip placement='bottom' title='Jhon Doe'>
                    <span>Jhon Doe</span>
                </Tooltip>
            </div>
            <div className='user-avatar'>
                <img id='avatar-img' src='user-avatar.png' alt='user avatar' />
            </div>
            <Button className='logoff'>
                <PoweroffOutlined />
            </Button>
        </div>
    );
}

export default UserInfo;