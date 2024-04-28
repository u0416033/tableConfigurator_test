import { OrbitControls, Stage } from "@react-three/drei";
import { Table } from "./Table";
import { useConfigurator } from "../contexts/Configurator";

export const Experience = () => {
  const { leg } = useConfigurator();
  return (
    <>
      <Table></Table>

      <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
    </>
  );
};
