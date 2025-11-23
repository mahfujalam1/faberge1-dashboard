import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button, Form } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import CustomButton from "../../utils/CustomButton";
import { toast } from "sonner";
import {
  useGetTermsConditionQuery,
  useUpdateTermsConditionMutation,
} from "../../redux/features/terms-and-condition/terms";

const EditTermsConditions = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");

  const { data, isLoading } = useGetTermsConditionQuery();
  const termsData = data?.termsAndConditions;

  const [updateTerms, { isLoading: isUpdating }] =
    useUpdateTermsConditionMutation();

  // Set initial content when data loads
  useEffect(() => {
    if (termsData) {
      setContent(termsData);
      form.setFieldsValue({ content: termsData });
    }
  }, [termsData, form]);

  const handleSubmit = async () => {
    try {
      const res = await updateTerms({ termsAndConditions: content }).unwrap();
      toast.success(res?.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (termsData) {
      setContent(termsData);
      form.setFieldsValue({ content: termsData });
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
          <Link to="/legalities/terms-conditions">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit Terms and Conditions</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg shadow-md bg-white">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Terms and Conditions Content */}
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

export default EditTermsConditions;
