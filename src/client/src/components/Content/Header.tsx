import Search from './Search';
import UserInfo from './UserInfo';

import './Header.css';

function Header() {
    return (
        <div className='header'>
            <div className='search-wrapper'>
                <Search />
            </div>
            <div className='user-info-wrapper'>
                <UserInfo />
            </div>
        </div>
    );
}

export default Header;