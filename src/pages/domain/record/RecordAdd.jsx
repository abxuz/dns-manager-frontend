import React from 'react';
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppNavCtx } from '@/ctx.js';

import api from '@/api.js'

const RecordAdd = _ => {

    const { domain } = useParams()
    const navigate = useNavigate()

    const [host, setHost] = React.useState('')
    const [type, setType] = React.useState('A')
    const [value, setValue] = React.useState('')
    const [priority, setPriority] = React.useState(1)
    const [ttl, setTtl] = React.useState(600)
    const [remark, setRemark] = React.useState('')
    const [saving, setSaving] = React.useState(false)
    const submit = async () => {
        let record = {
            host: host,
            domain: domain,
            type: type,
            value: value,
            ttl: ttl,
            remark: remark
        }
        if (type === 'MX') record.priority = priority;
        setSaving(true)
        let r = await api.domain.record.add(domain, record)
        setSaving(false)
        if (!r) return
        message.success('添加成功')
        navigate(-1)
    }

    const appNavCtx = React.useContext(AppNavCtx)
    React.useEffect(() => {
        appNavCtx.setBreadcrumb([
            { label: '域名管理', link: 'domain' },
            { label: '解析管理', link: 'domain/' + encodeURIComponent(domain) + '/record' },
            { label: '添加解析', link: 'domain/' + encodeURIComponent(domain) + '/record/add' },
        ])
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 6 }}>
                <Form.Item label="主机名" required>
                    <Input
                        addonAfter={'.' + domain}
                        value={host}
                        onChange={e => { setHost(e.target.value) }} />
                </Form.Item>
                <Form.Item label="类型" required wrapperCol={{ span: 2 }}>
                    <Select value={type} onChange={e => { setType(e) }}>
                        <Select.Option value="A">A</Select.Option>
                        <Select.Option value="AAAA">AAAA</Select.Option>
                        <Select.Option value="CNAME">CNAME</Select.Option>
                        <Select.Option value="TXT">TXT</Select.Option>
                        <Select.Option value="MX">MX</Select.Option>
                        <Select.Option value="NS">NS</Select.Option>
                        <Select.Option value="SRV">SRV</Select.Option>
                        <Select.Option value="CAA">CAA</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="TTL" required>
                    <InputNumber
                        min={1} value={ttl}
                        onChange={v => { setTtl(v) }} />
                </Form.Item>
                <Form.Item label="优先级" required style={{
                    display: type === 'MX' ? '' : 'none'
                }}>
                    <InputNumber
                        min={1} value={priority}
                        onChange={v => { setPriority(v) }} />
                </Form.Item>
                <Form.Item label="记录值" required>
                    <Input value={value} onChange={e => { setValue(e.target.value) }} />
                </Form.Item>
                <Form.Item label="备注">
                    <Input value={remark} onChange={e => { setRemark(e.target.value) }} />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2, span: 24 }}>
                    <Button type="primary" onClick={submit} loading={saving}>添加</Button>
                    <Button style={{ marginLeft: '10px' }}>
                        <Link to={-1}>取消</Link>
                    </Button>
                </Form.Item>
            </Form>
        </div >
    )
}
export default RecordAdd;