import { DownloadOutlined, DeleteOutlined, SortAscendingOutlined, CheckSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import SubMenu from 'antd/lib/menu/SubMenu';
import CommandbarProps from 'interfaces/props/commandbarProps';

import './index.css';

function Commandbar(props: CommandbarProps) {
    return (
        <div className='commandbar-wrapper'>
            <h2 className='title'>{props.title}</h2>
            <Menu className='commandbar' key='command-bar' mode='horizontal' selectable={false}>
                <Menu.Item key='fa-placeholder' id='cmdbar-placeholder'>
                    <span></span>
                </Menu.Item>
                {props.selectedCount == 1 &&
                    <Menu.Item key='fa-download'>
                        <DownloadOutlined /> Download
                    </Menu.Item>}
                {props.selectedCount > 0 &&
                    <Menu.Item key='fa-delete' onClick={() => props.onDeleteRequest()}>
                        <DeleteOutlined /> Delete
                    </Menu.Item>}
                {props.totalCount > 0 && props.selectedCount == props.totalCount &&
                    <Menu.Item key='fa-unselectAll' onClick={() => props.onSelectionToggleAll(false)}>
                        <MinusSquareOutlined /> Unselect All
                    </Menu.Item>}
                {props.totalCount > 0 && props.selectedCount < props.totalCount &&
                    <Menu.Item key='fa-selectAll' onClick={() => props.onSelectionToggleAll(true)}>
                        <CheckSquareOutlined /> Select All
                    </Menu.Item>}
                {props.totalCount > 0 &&
                    <SubMenu key='sorting' icon={<SortAscendingOutlined />} title='Sorting'>
                        <Menu.Item key='name-asc'>Name ascending</Menu.Item>
                        <Menu.Item key='name-desc'>Name descending</Menu.Item>
                        <Menu.Item key='size-asc'>Size ascending</Menu.Item>
                        <Menu.Item key='size-desc'>Size descending</Menu.Item>
                    </SubMenu>}
            </Menu>
        </div>
    );
}

export default Commandbar;