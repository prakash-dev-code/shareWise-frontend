"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Space,
  message,
  Spin,
  Tag,
  Divider,
  Alert,
} from "antd";
import { ArrowLeftOutlined, RobotOutlined } from "@ant-design/icons";

import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/services/apiServices";

const { Title, Paragraph, Text } = Typography;

export default function ArticleDetailPage() {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<any>("");
  const [showSummary, setShowSummary] = useState(false);
  const { getArticlesById, generateSummary } = useApi();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const userString = localStorage.getItem("authUser");
  const loggedUser = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data: any = await getArticlesById(id);
      if (data) {
        setArticle(data);
        if (data.summary) {
          setSummary(data?.summary);
        }
      }
    } catch (error) {
      message.error("Failed to fetch article");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!article) return;

    setSummaryLoading(true);
    try {
      const generatedSummary: any = await generateSummary(article.id);

      setSummary(generatedSummary.summary);
      setShowSummary(true);

      const updatedArticle = { ...article, summary: generatedSummary };
      setArticle(updatedArticle);

      message.success("Summary generated successfully");
    } catch (error) {
      message.error("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
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

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/articles")}
          style={{ marginBottom: "16px" }}
        >
          Back to Articles
        </Button>

        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0, marginBottom: "8px" }}>
                {article.title}
              </Title>
              <Space size="middle">
                <Text type="secondary">
                  By <Tag color="blue">{article.author.name}</Tag>
                </Text>
                <Text type="secondary">
                  Created: {formatDate(article.createdAt)}
                </Text>
              </Space>
            </div>
          </div>

          <Divider />

          <div style={{ marginBottom: "24px" }}>
            <Paragraph style={{ fontSize: "16px", lineHeight: "1.6" }}>
              {article.content}
            </Paragraph>
          </div>

          <Divider />

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              {summary && (
                <Title level={4} style={{ margin: 0 }}>
                  AI Summary
                </Title>
              )}
              {article.author.id === loggedUser.id && (
                <>
                  <Button
                    type="primary"
                    icon={<RobotOutlined />}
                    loading={summaryLoading}
                    onClick={handleGenerateSummary}
                    disabled={!!summary}
                  >
                    {summary ? "Summary Generated" : "Generate Summary"}
                  </Button>
                </>
              )}
            </div>

            {summary && (
              <Card
                size="small"
                style={{
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                }}
              >
                <Paragraph style={{ margin: 0, fontStyle: "italic" }}>
                  {summary}
                </Paragraph>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
