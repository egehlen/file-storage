import { Outlet } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import Sidebar from 'components/Sidebar';
import Main from 'components/Content/Main';


function Layout() {
    return (
        <AntLayout className='app'>
            <Sidebar />
            <Content>
                <Main>
                    <Outlet />
                </Main>
            </Content>
        </AntLayout>
    );
}

export default Layout;