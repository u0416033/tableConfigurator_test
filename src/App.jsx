import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Interface } from "./components/Interface";

function App() {
  return (
    <>
      <Canvas shadows={true} camera={{ position: [4, 4, -12], fov: 35 }}>
        <Experience />
      </Canvas>
      <Interface></Interface>
    </>
  );
}

export default App;
