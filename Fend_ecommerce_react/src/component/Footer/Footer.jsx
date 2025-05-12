import React from "react";
import footerLogo from "../../assets/logo.png";
import Banner from "../../assets/website/footer-pattern.jpg";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
};

const Footer = () => {
  return (
    <div style={BannerImg} className="text-white">
      <div className="container">
        <div
          data-aos="zoom-in"
          className="flex flex-col md:flex-row justify-between pb-44 pt-5 gap-6"
        >
          {/* Left - Company Details */}
          <div className="md:w-1/3 py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img src={footerLogo} alt="Shop Logo" className="max-w-[50px]" />
              Shop
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
              Cum in beatae ea recusandae blanditiis veritatis.
            </p>
          </div>

          <div className="md:w-1/3 hidden md:block py-8 px-4"></div>

          {/* Right - Social + Contact */}
          <div className="md:w-1/3 py-8 px-4">
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <FaLocationArrow />
                <p>Noida, Uttar Pradesh</p>
              </div>
              <div className="flex items-center gap-3">
                <FaMobileAlt />
                <p>+91 123456789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
