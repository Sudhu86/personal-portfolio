import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Backend Engineer</h4>
                <h5>Western Union · Pune, India</h5>
              </div>
              <h3>Feb 2023 – Present</h3>
            </div>
            <p>
              Worked on designing, developing, and optimizing scalable backend
              systems using Java and Spring Boot, with strong exposure to
              microservices architecture, RESTful API development, and
              distributed system design. Contributed to an Order Management
              System (OMS) using Spring Boot-based microservices architecture,
              implemented REST APIs for order lifecycle management, and integrated
              Kafka-based event-driven architecture. Improved API response time
              by ~30% by optimizing business logic and reducing redundant service
              calls. Worked on User Profile & Authentication Service with secure
              APIs for registration, login, and profile management, reducing API
              failure rates by ~25% through validation and standardized error
              handling. Optimized MySQL queries and indexing for ~35% better
              performance, and supported CI/CD integration using Jenkins and
              GitLab CI (including Docker and AWS deployment experience),
              reducing deployment time by ~40%. Participated in Agile/Scrum
              and performed production debugging and root cause analysis with
              monitoring tools like Splunk, reducing issue resolution time by
              ~30% and improving observability.
            </p>
          </div>

          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Web Intern</h4>
                <h5>MABB Social Virtual</h5>
              </div>
              <h3>Feb 2022 – Apr 2022</h3>
            </div>
            <p>
              Developed responsive web pages using HTML, CSS, JavaScript, and
              jQuery; built UI components and improved website responsiveness
              across devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
