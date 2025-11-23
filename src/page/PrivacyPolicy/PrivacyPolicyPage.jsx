import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";
import { useGetPrivacyPolicyQuery } from "../../redux/features/privacyPolicy/privacy-policy";

const PrivacyPolicyPage = () => {
  const { data } = useGetPrivacyPolicyQuery();
  const privacyData = data?.privacyPolicy;

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/legalities">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>
        <Link to={"/legalities/edit-privacy-policy/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      <div>
        <div className="text-lg text-black px-5">
          <div
            dangerouslySetInnerHTML={{
              __html: privacyData || "",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;
