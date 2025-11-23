import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";
import { useGetTermsConditionQuery } from "../../redux/features/terms-and-condition/terms";

const TermsConditions = () => {
  const { data } = useGetTermsConditionQuery();
  const termsData = data?.termsAndConditions;
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/legalities">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Term & Condition</h1>
        </div>
        <Link to={"/legalities/edit-terms-conditions/11"}>
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
              __html: termsData || "",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
