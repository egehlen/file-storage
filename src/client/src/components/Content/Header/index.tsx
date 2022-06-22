import Search from 'components/Content/Search';
import UserInfo from 'components/Content/UserInfo';
import HeaderProps from 'interfaces/props/headerProps';

import './index.css';

function Header(props: HeaderProps) {
    return (
        <div className='header'>
            <div className='search-wrapper'>
                <Search onFilter={props.onFilter} />
            </div>
            <div className='user-info-wrapper'>
                <UserInfo />
            </div>
        </div>
    );
}

export default Header;