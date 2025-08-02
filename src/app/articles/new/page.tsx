"use client";

import { useState } from "react";
import { Card, Form, Input, Button, message, Typography, Space } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { useApi } from "@/services/apiServices";

const { Title } = Typography;
const { TextArea } = Input;

export default function NewArticlePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { createArticle } = useApi();

  const handleSubmit = async (values: { title: string; content: string }) => {
    setLoading(true);
    try {
      const data = {
        title: values.title,
        content: values.content,
      };

      const res = await createArticle(data);
      message.success("Article created successfully");
      router.push("/articles");
    } catch (error) {
      message.error("Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push("/articles")}
        style={{ marginBottom: "16px" }}
      >
        Back to Articles
      </Button>

      <Card>
        <Title level={2}>Create New Article</Title>

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
              { max: 50, message: "Title must not exceed 200 characters" },
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
                Create Article
              </Button>
              <Button onClick={() => router.push("/articles")} size="large">
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
