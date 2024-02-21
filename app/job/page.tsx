'use client'

import {Layout, Nav, Table, Typography} from "@douyinfe/semi-ui";
import useSWR from "swr";
import {fetcher, FileList} from "@/app/lib/api-streamer";
import {JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal,
    useState
} from "react";
import {IconCustomerSupport, IconVideoListStroked} from "@douyinfe/semi-icons";
import {humDate} from "@/app/lib/utils";

export default function Home() {
    const {Header, Footer, Sider, Content} = Layout;
    const {data: data, error, isLoading} = useSWR<any[]>("/v1/streamer-info", fetcher);
    if (isLoading) {
        return (<>Loading</>);
    }
    const {Text} = Typography;
    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            render: (text: any, record: any, index: any) => {
                return (
                    <Text strong>{text}</Text>
                );
            }
        }, {
            title: '名称',
            dataIndex: 'name',
        }, {
            title: '链接',
            dataIndex: 'url',
        },
        {
            title: '封面',
            dataIndex: 'live_cover_path',
        },
        {
            title: '更新日期',
            dataIndex: 'date',
            render: (text: any, record: any, index: any) => {
                return (<>{humDate(text)}</>);
            },
            sorter: (a: any, b: any) => (a.updateTime - b.updateTime > 0 ? 1 : -1),
        },
    ];
    const expandRowRender = (record: any, index: number | undefined) => {
        return <>文件列表：{record.files.map((it: { id: Key | null | undefined; file: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }) => {
            return <div key={it.id}>&nbsp;&nbsp;文件名：{it.file}</div>;
        })}</>;
    };
    return (<>
        <Header style={{backgroundColor: 'var(--semi-color-bg-1)'}}>
            <Nav style={{border: 'none'}}
                 header={<>
                     <div style={{
                        backgroundColor: 'rgb(250 102 76)',
                        borderRadius: 'var(--semi-border-radius-large)',
                        color: 'var(--semi-color-bg-0)',
                        display: 'flex',
                        padding: '6px'
                    }}><IconCustomerSupport size='large'/></div>
                     <h4 style={{marginLeft: '12px'}}>录播管理</h4></>}
                 mode="horizontal"
            ></Nav>
        </Header>
        <Content
            style={{
                paddingLeft: 12,
                paddingRight: 12,
                backgroundColor: 'var(--semi-color-bg-0)',
            }}
        >
            <main>
                <Table size="small"
                       rowKey="id"
                       columns={columns}
                       dataSource={data}
                    expandedRowRender={expandRowRender}
                />
            </main>
        </Content>
    </>);
}