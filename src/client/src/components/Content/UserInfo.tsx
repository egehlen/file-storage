import { PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Tooltip } from "antd";
import userAvatar from 'assets/user-avatar.png';

import './UserInfo.css';

function UserInfo() {
    const userActionsMenu = (
        <Menu onClick={() => {}}>
            
            <Menu.Item key='info' disabled><UserOutlined /> Wallet connected</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='logoff'><PoweroffOutlined /> Logoff</Menu.Item>
        </Menu>
    );

    return (
        <div className='user-info'>
            <div className='wallet-address'>
                <Tooltip placement='bottom' title='0x4dB9F75fd9e7f117A6051F78DB3E50b20060eE52'>
                    <span>0x4dB9...eE52</span>
                </Tooltip>
            </div>
            <div className='user-avatar'>
                <img src={userAvatar} alt='user avatar' />
            </div>
            <Dropdown.Button
                className='user-actions'
                overlay={userActionsMenu}
            />
        </div>
    );
}

export default UserInfo;