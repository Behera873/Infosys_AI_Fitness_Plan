export default function ExerciseGallery({ exercises }) {
  return (
    <div className="exercise-gallery">
      {exercises.map((ex,i)=>(
        <div className="exercise-card" key={i}>
          <h3>{ex.name}</h3>

          <iframe
            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(ex.video_query)}`}
            allowFullScreen
            title={ex.name}
          />

          <ul>
            {ex.steps.map((s,idx)=><li key={idx}>{s}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
