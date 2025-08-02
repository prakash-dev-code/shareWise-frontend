"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Card,
  Typography,
  Popconfirm,
  Tag,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Article } from "@/types/article";
// import { articleApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useApi } from "@/services/apiServices";
import toast from "react-hot-toast";
const { getAllArticles, deleteArticle } = useApi();
const { Title } = Typography;
const { Search } = Input;

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const userString = localStorage.getItem("authUser");
  const loggedUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data: any = await getAllArticles();
      setArticles(data.data);
    } catch (error) {
      message.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      message.success("Article deleted successfully");
      fetchArticles();
    } catch (error) {
      message.error("Failed to delete article");
      message.error(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchText.toLowerCase()) ||
      article.content.toLowerCase().includes(searchText.toLowerCase()) ||
      article.createdBy.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<Article> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: Article) => (
        <Button
          type="link"
          onClick={() => router.push(`/articles/${record.id}`)}
          style={{ padding: 0, height: "auto" }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Author",
      dataIndex: "",
      key: "",
      render: (record) => <Tag color="blue">{record.author.name}</Tag>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record: any) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/articles/${record.id}`)}
            />
          </Tooltip>
          {record.author.id === loggedUser.id && (
            <>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/articles/${record.id}/edit`)}
                />
              </Tooltip>
              <Tooltip title="History">
                <Button
                  type="text"
                  icon={<HistoryOutlined />}
                  onClick={() => router.push(`/articles/${record.id}/history`)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this article?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Tooltip>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Knowledge Articles
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/articles/new")}
          >
            Create Article
          </Button>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Search
            placeholder="Search articles..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredArticles}
          rowKey="id"
          loading={loading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} articles`,
          }}
        />
      </Card>
    </div>
  );
}
