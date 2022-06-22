import { FilePdfOutlined, FileUnknownOutlined, FileWordOutlined, FileZipOutlined, LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { Spin, ConfigProvider, List, Card, Checkbox, Tooltip, Empty } from 'antd';
import Meta from 'antd/lib/card/Meta';
import File from 'interfaces/file';
import FileListProps from 'interfaces/props/fileListProps';
import './index.css';

function FileList(props: FileListProps) {

    const fileTypes: any = {
        'image/png': {
            title: 'Image',
            icon: null
        },
        'image/jpg': {
            title: 'Image',
            icon: null
        },
        'image/jpeg': {
            title: 'Image',
            icon: null
        },
        'application/zip': {
            title: 'Zipped file',
            icon: <div className='file-type-item'><FileZipOutlined /></div>
        },
        'application/pdf': {
            title: 'PDF document',
            icon: <div className='file-type-item'><FilePdfOutlined /></div>
        }
    }

    function isSelected(hash: string): boolean | undefined {
        return props.files.find(file => file.hash === hash)?.selected;
    }

    function getReadableType(type?: string) {
        if (type) {
            return fileTypes[type].title || 'Unknown';
        }

        return 'Unknown';
    }

    function getReadableSize(size?: number) {
        if (size) {
            if (size > 1000)
                return `${Math.round(size / 1000)} KB`
            else
                return `${size} Bytes`
        }

        return '0 Bytes';
    }

    function getItemThumbnail(item: File) {
        if (item) {
            if (item.thumbnail) {
                let content = Buffer.from(item.thumbnail).toString('base64');
                return <img className='file-type-item' alt={item.name} src={`data:${item.type};base64,${content}`} />;
            }
            
            return fileTypes[item.type].icon;
        }

        return <div className='file-type-item'><FileUnknownOutlined /></div>;
    }

    function getVisibleFiles(): File[] {
        return props.files.filter(file => file.visible);
    }

    const customRenderEmpty = () => (
        <Empty
            className='file-list-empty-state'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <>
                    <h4>No files.</h4><br/>
                    <p>
                        Use the menu action '{<UploadOutlined />} Upload'<br/>
                        to send your files.
                    </p>
                </>
            }
        />
    );

    return (
        <div className='file-list-wrapper'>
            <Spin
                style={{ display: (!props.loaded ? 'flex' : 'none') }}
                className='file-list-loading'
                tip='Loading'
                indicator={<LoadingOutlined spin />}
            >
            </Spin>

            <ConfigProvider renderEmpty={customRenderEmpty}>
                <List
                    className='file-list'
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={getVisibleFiles()}
                    renderItem={item => (
                        <List.Item>
                            <Spin 
                                className='fl-card-processing'
                                spinning={item.processing}
                                indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
                            >
                                <Card
                                    onClick={() => props.onSelectionToggleSingle(item.hash)}
                                    className={`fl-card ${isSelected(item.hash) ? 'fl-card-selected' : ''}`}
                                    hoverable
                                    cover={getItemThumbnail(item)}
                                >
                                    <Checkbox
                                        className='fl-selection'
                                        checked={isSelected(item.hash)}
                                        style={{ visibility: (isSelected(item.hash) ? 'visible' : 'hidden') }}
                                    />
                                    <Meta title={
                                        <Tooltip title={item.name} placement='right'>
                                            {item.name}
                                        </Tooltip>
                                    } description={`${getReadableType(item.type)} | ${getReadableSize(item.size)}`} />
                                </Card>
                            </Spin>
                        </List.Item>
                    )} />
            </ConfigProvider>
        </div>
    );
}

export default FileList;