import { DownloadOutlined, DeleteOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import ICommandbarProps from 'interfaces/props/ICommandbarProps';

import './Commandbar.css';

function Commandbar(props: ICommandbarProps) {
    
    function selectedFilesCount() {
        return 1;
    }

    return (
        <div className='commandbar-wrapper'>
            <h2 className='title'>{props.title}</h2>
            <Menu className='commandbar' key='command-bar' mode='horizontal' selectable={false}>
                {selectedFilesCount() > 0 &&
                    <Menu.Item key='fa-download'>
                        <DownloadOutlined /> Download
                    </Menu.Item>}
                {selectedFilesCount() > 0 &&
                    <Menu.Item key='fa-delete' onClick={() => {}}>{/*props.onDeleteRequest()*/}
                        <DeleteOutlined /> Delete
                    </Menu.Item>}
                <SubMenu key='sorting' icon={<SortAscendingOutlined />} title='Sorting'>
                    <Menu.Item key='name-asc'>Name ascending</Menu.Item>
                    <Menu.Item key='name-desc'>Name descending</Menu.Item>
                    <Menu.Item key='size-asc'>Size ascending</Menu.Item>
                    <Menu.Item key='size-desc'>Size descending</Menu.Item>
                </SubMenu>
            </Menu>
        </div>
    );
}

export default Commandbar;