import { useState, useEffect } from "react";

const Index = () => {
  const [test, setTest] = useState("Loading...");
  
  useEffect(() => {
    setTest("React is working!");
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>{test}</h1>
      <p>If you see this, React hooks are working correctly.</p>
    </div>
  );
};

export default Index;
