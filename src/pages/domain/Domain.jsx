import React from 'react';
import { Button, Table, Tag } from "antd";
import { Link } from "react-router-dom";
import { AppNavCtx } from '@/ctx.js';

import api from '@/api.js';

const { Column } = Table;

const Domain = _ => {

    const [loading, setLoading] = React.useState(false)
    const [data, setData] = React.useState([])
    const loadData = async () => {
        setLoading(true)
        let r = await api.domain.list();
        setLoading(false)
        if (!r) return
        setData(r)
    }

    const appNavCtx = React.useContext(AppNavCtx)
    React.useEffect(() => {
        appNavCtx.setBreadcrumb([{ label: '域名管理', link: 'domain' }])
        loadData();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Table dataSource={data} rowKey={v => v.domain} loading={loading}>
                <Column title="域名" dataIndex="domain" key="domain" />
                <Column title="服务商" key="provider" render={(_, v) => (
                    <Tag>{v.provider}</Tag>
                )} />
                <Column title="操作" key="op" render={(_, v) => (
                    <div className="table-op">
                        <Button type="link" size="small">
                            <Link to={'/domain/' + v.domain + '/record'}>解析管理</Link>
                        </Button>
                    </div>
                )} />
            </Table>
        </div >
    )
}
export default Domain;