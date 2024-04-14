import "../styles/Footer.css"
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-texts-container">
        <a className="alfblogs" href="/">
          Alf<span>Blogs</span>
        </a>
        <p className="footer-subheading">2023 PUP Manila AWSCC-DSWD. All Rights Reserved.</p>
      </div>
      <div className="footer-icons-container">
        <a href="#">
            <FaInstagram size={28} color="#b6b6b6" />
        </a>
        <a href="#">
          <FaFacebook size={28} color="#b6b6b6" />
        </a>
        <a href="#">
            <FaLinkedin size={28} color="b6b6b6" />
        </a>
      </div>
    </div>
  );
};

export default Footer;