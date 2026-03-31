import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Backend Software Developer with 3+ years of experience building
          production-ready systems using Java and Spring Boot.
          I design RESTful microservices, implement API security and validation,
          and integrate event-driven communication with Apache Kafka.
          I also optimize MySQL schemas and queries to improve performance and
          reliability—focusing on scalability, fault tolerance, and clean service
          boundaries.
          I ship features using Docker and CI/CD pipelines (Jenkins, GitLab CI),
          and collaborate in Agile teams to deliver reliable backend solutions.
        </p>
      </div>
    </div>
  );
};

export default About;
