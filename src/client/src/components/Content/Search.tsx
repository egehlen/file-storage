import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';

import './Search.css';

function Search() {
    const [query, setQuery] = useState('');

    function setValue(event: any) {
        setQuery(event.target.value);
    }

    return ( 
        <>
            <Input 
                className='search-input'
                placeholder='Search by file name'
                size='large'
                suffix={<SearchOutlined />}
                allowClear
                value={query}
                onChange={setValue}
            />
        </>
    );
}

export default Search;