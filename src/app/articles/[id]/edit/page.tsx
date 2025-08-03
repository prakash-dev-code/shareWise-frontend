"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Typography,
  Space,
  Spin,
  Alert,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import type { Article } from "@/types/article";
import { useRouter, useParams } from "next/navigation";
import { useApi } from "@/services/apiServices";

const { Title } = Typography;
const { TextArea } = Input;

export default function EditArticlePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [article, setArticle] = useState<Article | null>(null);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getArticlesById, updateArticlesById } = useApi();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    setFetchLoading(true);
    try {
      const data: any = await getArticlesById(id);
      if (data) {
        setArticle(data);
        form.setFieldsValue({
          title: data.title,
          content: data.content,
        });
      } else {
        message.error("Article not found");
        router.push("/articles");
      }
    } catch (error) {
      message.error("Failed to fetch article");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values: { title: string; content: string }) => {
    if (!article) return;

    setLoading(true);
    try {
      await updateArticlesById(id, {
        title: values.title,
        content: values.content,
      });
      message.success("Article updated successfully");
      router.push(`/articles`);
    } catch (error) {
      message.error("Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
          description="The article you're trying to edit doesn't exist."
          type="error"
          showIcon
        />
      </div>
    );
  }

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
        <Title level={2}>Edit Article</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter article title" },
              { min: 5, message: "Title must be at least 5 characters" },
              { max: 200, message: "Title must not exceed 200 characters" },
            ]}
          >
            <Input placeholder="Enter article title" size="large" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[
              { required: true, message: "Please enter article content" },
              { min: 50, message: "Content must be at least 50 characters" },
            ]}
          >
            <TextArea
              placeholder="Write your article content here..."
              rows={15}
              showCount
              maxLength={10000}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
              >
                Update Article
              </Button>
              <Button
                onClick={() => router.push(`/articles/${id}`)}
                size="large"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
