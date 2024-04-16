import "../styles/Hero.css"
import Button from "./Button"
import Blur from "./Blur"

const Hero = () => {
  return (
    <div className="hero-main" id="heroSection">
       <Blur
        h={"45%"}
        w={"50%"}
        bg={"#7000FF"}
        x={"35%"}
        y={"50%"}
        opacity={0.25}
        blur={"800px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"45%"}
        w={"50%"}
        bg={"#FF00C7"}
        x={"65%"}
        y={"50%"}
        opacity={0.25}
        blur={"400px"}
        translate_x={"-50%"}
        translate_y={"-50%"}
        border_radius={"100%"}
      />
      <Blur
        h={"120%"}
        w={"65%"}
        bg={"#ED8C38"}
        x={"-22.5%"}
        y={"5%"}
        opacity={0.54}
        blur={"400px"}
        translate_x={0}
        translate_y={0}
        border_radius={"100%"}
      />
      <div className="hero-text-content">
        <p className="top-text">AWSCC PUP Manila - DSWD</p>
        <p className="center-text">
          It's always <br />
          <span>Day One</span>
        </p>
        <p className="bottom-text">Learn more about AWS, cloud computing, and anything you want!</p>
        <a href="#articleSection">
          <Button variants="outlined" size='md'>
            Explore
          </Button>
        </a>
      </div>

      {/* hero image content */}
      <div className="hero-img-content">
        <img src="/alf-ufo.svg" alt="UFO Alf" />
      </div>
    </div>
  );
};

export default Hero;