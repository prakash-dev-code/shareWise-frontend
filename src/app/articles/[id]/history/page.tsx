"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Timeline,
  message,
  Spin,
  Alert,
  Modal,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { Article, ArticleRevision } from "@/types/article";

import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/services/apiServices";

const { Title, Paragraph, Text } = Typography;

export default function ArticleHistoryPage() {
  const [article, setArticle] = useState<Article | null>(null);
  const [revisions, setRevisions] = useState<ArticleRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRevision, setSelectedRevision] =
    useState<ArticleRevision | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getHistory, getArticlesById } = useApi();

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articleData, revisionsData] = await Promise.all([
        getArticlesById(id),
        getHistory(id),
      ]);

      if (articleData && Object.keys(articleData).length > 0) {
        setArticle(articleData as Article);
        setRevisions(
          (revisionsData as ArticleRevision[]).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } else {
        message.error("Article not found");
        router.push("/articles");
      }
    } catch (error) {
      message.error("Failed to fetch article history");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRevision = (revision: ArticleRevision) => {
    setSelectedRevision(revision);
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Article Not Found"
          description="The article you're looking for doesn't exist."
          type="error"
          showIcon
        />
      </div>
    );
  }

  const timelineItems = [
    {
      color: "green",
      dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
      children: (
        <Card size="small" style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Current Version</Text>
              <Tag color="green" style={{ marginLeft: "8px" }}>
                CURRENT
              </Tag>
              <br />
              {/* <Text type="secondary">{formatDate(article.updatedAt)}</Text> */}
            </div>
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/articles/${id}`)}
            >
              View Current
            </Button>
          </div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            style={{ margin: "8px 0 0 0", color: "#666" }}
          >
            {article.content}
          </Paragraph>
        </Card>
      ),
    },

    ...revisions.map((revision, index) => ({
      color: "blue",
      children: (
        <Card size="small" style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Text strong>Version {index + 1}</Text>
              <br />
              <Text type="secondary">{formatDate(revision.createdAt)}</Text>
            </div>
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleViewRevision(revision)}
            >
              View
            </Button>
          </div>
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            style={{ margin: "8px 0 0 0", color: "#666" }}
          >
            {revision.content}
          </Paragraph>
        </Card>
      ),
    })),
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push(`/articles`)}
        style={{ marginBottom: "16px" }}
      >
        Back to Article
      </Button>

      <Card>
        <Title level={3}>Article History</Title>
        <Title level={4} style={{ color: "#666", fontWeight: "normal" }}>
          {article.title}
        </Title>

        {revisions.length === 0 ? (
          <Alert
            message="No Edit History"
            description="This article hasn't been edited yet."
            type="info"
            showIcon
          />
        ) : (
          <Timeline items={timelineItems} />
        )}
      </Card>

      <Modal
        title={`Version #${selectedRevision?.id.slice(0, 5)} - ${
          selectedRevision?.title
        }`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedRevision && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Text type="secondary">
                Created: {formatDate(selectedRevision.createdAt)}
              </Text>
            </div>
            <Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {selectedRevision.content}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
}
