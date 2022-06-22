import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { useState } from 'react';
import SearchProps from 'interfaces/props/searchProps';

import './index.css';

function Search(props: SearchProps) {
    const [query, setQuery] = useState<string>('');

    function setValue(event: any) {
        setQuery(event.target.value);
        props.onFilter(event.target.value);
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