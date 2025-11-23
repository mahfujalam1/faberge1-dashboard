import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button, Form } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import CustomButton from "../../utils/CustomButton";
import {
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
} from "../../redux/features/site-content/site-content";
import { toast } from "sonner";

const EditAboutUs = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const { data, isLoading } = useGetAboutUsQuery();
  const aboutUsData = data?.aboutUs;

  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();

  // Set initial content when data loads
  useEffect(() => {
    if (aboutUsData) {
      setContent(aboutUsData);
      form.setFieldsValue({ content: aboutUsData });
    }
  }, [aboutUsData, form]);

  const handleSubmit = async () => {
    try {
      const res = await updateAboutUs({ aboutUs: content }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      console.log(error)
      console.error("Error:", error);
      // Error message show korar jonno notification add korte paro
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (aboutUsData) {
      setContent(aboutUsData);
      form.setFieldsValue({ content: aboutUsData });
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
          <Link to="/site-content">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit About Us</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg shadow-md bg-white">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for About Us Content */}
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

export default EditAboutUs;
