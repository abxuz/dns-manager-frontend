import React from 'react';
import { Route, Navigate, Routes, Outlet, Link, useNavigate } from 'react-router-dom';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { Breadcrumb, Layout, Menu } from 'antd';
import { AppNavCtx } from '@/ctx.js';

import Domain from '@/pages/domain/Domain';

import Record from '@/pages/domain/record/Record';
import RecordAdd from '@/pages/domain/record/RecordAdd';
import RecordEdit from '@/pages/domain/record/RecordEdit';

import './App.css';

const App = _ => {

    const navigate = useNavigate()
    const menuItems = [
        { key: 'domain', label: '域名管理' },
    ]

    const [breadcrumb, setBreadcrumb] = React.useState([])
    const breadcrumbItems = [{ label: '首页', link: '/' }].concat(breadcrumb).map(v => ({ title: (<Link to={v.link}>{v.label}</Link>) }))

    const menuItemClick = (v) => {
        switch (v.key) {
            case 'domain':
                navigate('domain')
                break
            default:
        }
    }

    return (
        <Layout style={{ height: '100%' }}>
            <Header>
                <div id='nav-logo'>域名管理系统</div>
                <Menu
                    id='nav-menu'
                    selectable={false}
                    theme='dark'
                    mode='horizontal'
                    items={menuItems}
                    onClick={menuItemClick} />
                <div id='nav-op'></div>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
                <div className="site-layout-content">
                    <AppNavCtx.Provider value={{ setBreadcrumb }}>
                        <Routes>
                            <Route path='domain' element={<Outlet />}>
                                <Route path='' element={<Domain />} />
                                <Route path=':domain/record' element={<Outlet />}>
                                    <Route path='' element={<Record />} />
                                    <Route path='add' element={<RecordAdd />} />
                                    <Route path=':id' element={<RecordEdit />} />
                                </Route>
                            </Route>
                            <Route path='/' element={<Navigate to='domain' />} />
                            <Route path='*' element={<Navigate to='404' replace />} />
                        </Routes>
                    </AppNavCtx.Provider>
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Doubi.fun ©2023
            </Footer>
        </Layout >
    );
}

export default App;
