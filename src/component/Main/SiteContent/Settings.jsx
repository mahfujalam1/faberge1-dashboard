/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import HomeBanner from "./HomeBanner";
import ServiceBanner from "./ServiceBanner";

const Settings = () => {
  const navigate = useNavigate();
  const [bannerOpen, setBannerOpen] = useState(false);
  const [serviceBannerOpen, setServiceBannerOpen] = useState(false);

  const settingsItem = [
    { title: "About us", path: "about-us" },
    { title: "Home Banner", path: "home-banner" },
    { title: "Service Banner", path: "service-banner" },
  ];

  const handleNavigate = (value) => {
    if (value === "home-banner") {
      setBannerOpen(!bannerOpen);
    } else if (value === "service-banner") {
      setServiceBannerOpen(!serviceBannerOpen);
    } else {
      navigate(`/site-content/${value}`);
    }
  };

  return (
    <section className="w-full py-6">
      <h1 className="text-xl font-semibold text-gray-800 py-4 ms-4">
        Site Content
      </h1>

      {settingsItem.map((setting, index) => (
        <div key={index} className="w-full">
          {/* Setting Row */}
          <div
            className="w-full p-4 mb-2 text-sm border-gray-300 border-b flex items-center justify-between cursor-pointer transition-all"
            onClick={() => handleNavigate(setting.path)}
          >
            <h2 className="text-xl">{setting.title}</h2>

            {setting.path === "home-banner" ? (
              bannerOpen ? (
                <MdKeyboardArrowDown size={35} />
              ) : (
                <MdKeyboardArrowRight size={35} />
              )
            ) : setting.path === "service-banner" ? (
              serviceBannerOpen ? (
                <MdKeyboardArrowDown size={35} />
              ) : (
                <MdKeyboardArrowRight size={35} />
              )
            ) : (
              <MdKeyboardArrowRight size={35} />
            )}
          </div>

          {/* Home Banner Component */}
          {setting.path === "home-banner" && bannerOpen && (
            <HomeBanner onClose={() => setBannerOpen(false)} />
          )}

          {/* Service Banner Component */}
          {setting.path === "service-banner" && serviceBannerOpen && (
            <ServiceBanner onClose={() => setServiceBannerOpen(false)} />
          )}
        </div>
      ))}
    </section>
  );
};

export default Settings;
