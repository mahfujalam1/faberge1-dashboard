import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import CustomButton from "../../utils/CustomButton";
import { Button, Form } from "antd";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "../../redux/features/privacyPolicy/privacy-policy";
import { toast } from "sonner";

const EditPrivacyPolicy = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const { data, isLoading } = useGetPrivacyPolicyQuery();
  const privacyData = data?.privacyPolicy;

  const [updatePrivacy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyMutation();

  // Set initial content when data loads
  useEffect(() => {
    if (privacyData) {
      setContent(privacyData);
      form.setFieldsValue({ content: privacyData });
    }
  }, [privacyData, form]);

  const handleSubmit = async () => {
    try {
      const res = await updatePrivacy({ privacyPolicy: content }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      console.error("Error:", error);
      // Error message show korar jonno notification add korte paro
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (privacyData) {
      setContent(privacyData);
      form.setFieldsValue({ content: privacyData });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full h-full min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center gap-2">
          <Link to="/legalities/privacy-policy">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg shadow-md bg-white">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Privacy Policy Content */}
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
              style={{ height: "300px" }}
            />
          </Form.Item>

          {/* Update Button */}
          <div className="w-full flex justify-end gap-3 mt-20 md:mt-16">
            <Button
              type="default"
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-5 rounded-lg py-5"
            >
              Cancel
            </Button>
            <CustomButton
              className="p-1"
              htmlType="submit"
              loading={isUpdating}
            >
              Update
            </CustomButton>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditPrivacyPolicy;
