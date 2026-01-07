const ExerciseVideos = ({ exercises }) => {
  if (!exercises || exercises.length === 0) return null;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto" }}>
      <h2>Exercise Demonstrations</h2>

      {exercises.map((exercise, index) => (
        <div key={index} style={videoCard}>
          <h3>{exercise.name}</h3>

          <iframe
            width="100%"
            height="315"
            src={exercise.videoUrl}
            title={exercise.name}
            allowFullScreen
          ></iframe>

          <ul>
            {exercise.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const videoCard = {
  background: "#ffffff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

export default ExerciseVideos;
