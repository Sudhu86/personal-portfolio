import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              SUDHANSHU
              <br />
              <span>MANDHANIA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Backend Engineer &</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Systems</div>
              <div className="landing-h2-2">Digital</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Microservices</div>
              <div className="landing-h2-info-1">Infrastructure</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
