import { DeleteFilled, FolderFilled, InfoCircleFilled } from '@ant-design/icons';
import { Menu as AntMenu } from 'antd';
import { Link } from 'react-router-dom';

import './index.css';

function Menu() {

    return (
        <AntMenu className='menu' mode='inline' defaultSelectedKeys={['files']}>
            <AntMenu.Item key='files'>
                <Link to='/'><FolderFilled /> All files</Link>
            </AntMenu.Item>
            <AntMenu.Item key='deleted'>
                <Link to='/deleted'><DeleteFilled /> Deleted files</Link>
            </AntMenu.Item>
            <AntMenu.Item key='about'>
                <Link to='/about'><InfoCircleFilled /> About</Link>
            </AntMenu.Item>
        </AntMenu>
    );
}

export default Menu;