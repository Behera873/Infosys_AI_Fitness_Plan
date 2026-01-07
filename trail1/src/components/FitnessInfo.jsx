const FitnessInfo = ({ data }) => {
  if (!data) return null;

  return (
    <div style={cardStyle}>
      <h2>Fitness Overview</h2>
      <p><strong>Summary:</strong> {data.summary}</p>

      <h4>Recommended Activities</h4>
      <ul>
        {data.activities.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p><strong>Food Guidance:</strong> {data.food}</p>
    </div>
  );
};

const cardStyle = {
  background: "#f9f9f9",
  padding: "20px",
  borderRadius: "10px",
  margin: "20px auto",
  maxWidth: "700px",
};

export default FitnessInfo;
