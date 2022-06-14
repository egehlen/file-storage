import Upload from 'components/Sidebar/Upload';
import Menu from 'components/Sidebar/Menu';
import ISidebarProps from "interfaces/props/ISidebarProps";
import Sider from 'antd/lib/layout/Sider';

import './Sidebar.css';

function Sidebar(props: ISidebarProps) {

    return (
        <Sider className='sidebar' theme='light' width={'290px'}>
            <div className='app-title'>
                <span>FileStorage</span>
            </div>
            <Upload />
            <Menu />
        </Sider>
    );
}

export default Sidebar;