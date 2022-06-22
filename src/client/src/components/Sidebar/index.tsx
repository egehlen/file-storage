import Upload from 'components/Upload';
import Menu from 'components/Menu';
import Sider from 'antd/lib/layout/Sider';

import './index.css';

function Sidebar() {

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