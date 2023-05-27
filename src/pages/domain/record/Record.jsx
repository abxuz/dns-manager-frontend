import React from 'react';
import { Link } from "react-router-dom";
import { Button, Table, Tag, Modal, message } from "antd";
import { useParams } from "react-router-dom";
import { AppNavCtx } from '@/ctx.js';

import api from '@/api.js';

const { Column } = Table;

const Record = _ => {

    const { domain } = useParams();

    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState({ list: [], total: 0 })
    const [pageNumber, setPageNumber] = React.useState(1)
    const [pageSize, setPageSize] = React.useState(10)
    const loadData = async (domain, pageNumber, pageSize) => {
        setLoading(true)
        let r = await api.domain.record.list(domain, pageNumber, pageSize)
        setLoading(false)
        if (!r) return
        setData(r)
    }
    React.useEffect(() => {
        loadData(domain, pageNumber, pageSize)
    }, [domain, pageNumber, pageSize])

    const paginationChange = (newPageNumber, newPageSize) => {
        setPageNumber(newPageNumber)
        setPageSize(newPageSize)
    }

    const confirmDeleteRecord = v => {
        const doDelete = async () => {
            const hide = message.loading('正在删除...', 0);
            let r = await api.domain.record.delete(domain, v.id)
            hide()
            if (!r) return
            message.success('删除成功')
            loadData(domain, pageNumber, pageSize)
        }
        Modal.confirm({
            title: '危险操作',
            content: '确定要删除该记录？',
            onOk: doDelete
        })
    }

    const getTypeColor = type => {
        switch (type) {
            case 'A':
                return 'blue';
            case 'TXT':
                return 'orange';
            case 'CNAME':
                return 'green';
            case 'AAAA':
                return 'cyan';
            case 'MX':
                return 'magenta';
            case 'NS':
                return 'purple';
            default:
                break
        }
        return ''
    }

    const appNavCtx = React.useContext(AppNavCtx)
    React.useEffect(() => {
        appNavCtx.setBreadcrumb([
            { label: '域名管理', link: 'domain' },
            { label: '解析管理', link: 'domain/' + encodeURIComponent(domain) + '/record' },
        ])
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <div className="op-btns">
                <Button type="primary">
                    <Link to="add">添加解析</Link>
                </Button>
            </div>
            <Table
                dataSource={data.list}
                rowKey={v => v.id}
                loading={loading}
                pagination={{
                    current: pageNumber,
                    pageSize: pageSize,
                    total: data.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onChange: paginationChange,
                }}>
                <Column title="主机名" key="hostname" render={(_, v) => (
                    <span>{v.host}.{v.domain}</span>
                )} />
                <Column title="类型" key="type" render={(_, v) => (
                    <Tag color={getTypeColor(v.type)}>{v.type}</Tag>
                )} />
                <Column title="值" key="value" render={(_, v) => (
                    <Tag style={{ wordBreak: 'break-all', whiteSpace: 'break-spaces' }}>{v.value}</Tag>
                )} />
                <Column title="TTL" key="ttl" dataIndex="ttl" />
                <Column width="70px" title="优先级" key="priority" dataIndex="priority" />
                <Column title="备注" key="remark" dataIndex="remark" />
                <Column title="操作" key="op" render={(_, v) => (
                    <div className="table-op">
                        <Button type="link" size="small">
                            <Link to={'/domain/' + domain + '/record/' + v.id}>
                                编辑
                            </Link>
                        </Button>
                        <Button
                            onClick={() => { confirmDeleteRecord(v) }}
                            type="link"
                            danger
                            size="small">
                            删除
                        </Button>
                    </div>
                )} />
            </Table>
        </div>
    )
}
export default Record;