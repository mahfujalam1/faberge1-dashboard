import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
import { useGetAboutUsQuery } from "../../redux/features/site-content/site-content";

const AboutUsPage = () => {
  const { data } = useGetAboutUsQuery();
  const aboutUsData = data?.aboutUs;

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          <Link to="/site-content">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
        <Link to={"/site-content/edit-about-us/11"}>
          <CustomButton border>
            <TbEdit className="size-5" />
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>

      {/* Show Spin loader if data is loading */}

      <div>
        <div className="text-lg px-5 text-black">
          <div
            dangerouslySetInnerHTML={{
              __html: aboutUsData || "",
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
