import React, { useState } from "react";
import UserForm from "../components/UserForm";
import FitnessInfo from "../components/FitnessInfo";
import ExerciseVideos from "../components/ExerciseVideos";
import Loading from "../components/Loading";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [fitnessData, setFitnessData] = useState(null);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center" }}>Personalized Fitness Planner</h1>

      <UserForm
        setLoading={setLoading}
        setFitnessData={setFitnessData}
      />

      {loading && <Loading />}

      {fitnessData && (
        <>
          <FitnessInfo data={fitnessData.fitnessInfo} />
          <ExerciseVideos exercises={fitnessData.exercises} />
        </>
      )}
    </div>
  );
};

export default Home;
    