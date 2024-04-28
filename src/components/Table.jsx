import React, { useEffect, useRef, useState } from "react";
import { useGLTF, Stage } from "@react-three/drei";
import { useConfigurator } from "../contexts/Configurator";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

const Export = (map) => {
  const texture = map;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
  canvas.width = texture.image.width;
  canvas.height = texture.image.height;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, context: context });
  renderer.setSize(texture.image.width, texture.image.height);

  const rtScene = new THREE.Scene();
  const rtCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const rtPlane = new THREE.PlaneBufferGeometry(2, 2);
  const rtMaterial = new THREE.MeshBasicMaterial({ map: texture });
  const rtMesh = new THREE.Mesh(rtPlane, rtMaterial);
  rtScene.add(rtMesh);

  renderer.render(rtScene, rtCamera);

  const dataURL = canvas.toDataURL("image/png");

  const downloadLink = document.createElement("a");
  downloadLink.href = dataURL;
  downloadLink.download = "texture.png";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const ANIM_SPEED = 12;
// 新的 DynamicMesh 组件
const DynamicMesh = ({ map }) => {
  console.log(map);
  //   const texture = useLoader(THREE.TextureLoader, map);
  Export(map);
  return (
    <mesh position={[-2, 0.5, 2]} castShadow>
      <boxGeometry args={[3, 1, 1]} />
      <meshStandardMaterial attach="material" map={map} />
    </mesh>
  );
};

export function Table(props) {
  const { nodes, materials } = useGLTF("./models/Table.gltf");
  const { legs, legsColor, tableWidth } = useConfigurator();
  const [materialsSet, setMaterialsSet] = useState([]);
  useEffect(() => {
    console.log(materials);
    materials.Metal.color = new THREE.Color(legsColor);
  }, [legsColor]);

  useEffect(() => {
    setMaterialsSet(Object.keys(materials));

    console.log(materialsSet);
  }, []);

  const tableWidthScale = tableWidth / 100;
  const plate = useRef();
  const leftLegs = useRef();
  const rightLegs = useRef();

  useFrame((_state, delta) => {
    const targetScale = new THREE.Vector3(tableWidthScale, 1, 1);
    plate.current.scale.lerp(targetScale, delta * ANIM_SPEED);

    const leftPos = new THREE.Vector3(-1.5 * tableWidthScale, 0, 0);
    const rightPos = new THREE.Vector3(1.5 * tableWidthScale, 0, 0);

    leftLegs.current.position.lerp(leftPos, delta * ANIM_SPEED);
    rightLegs.current.position.lerp(rightPos, delta * ANIM_SPEED);
  });

  return (
    <>
      <Stage
        intensity={1.5}
        environment="city"
        shadows={{ type: "accumulative", color: "#d9afd9", colorBlend: 2, opacity: 1 }}
        adjustCamera={1}
      >
        {materialsSet.length !== 0 &&
          materialsSet.map((material, index) => {
            return materials[material].map ? (
              <DynamicMesh key={index} map={materials[material].map} />
            ) : null;
          })}

        <group {...props} dispose={null}>
          <mesh
            geometry={nodes.Plate.geometry}
            material={materials.Plate}
            castShadow
            scale={[tableWidthScale, 1, 1]}
            ref={plate}
          />
          {legs === 0 && (
            <>
              <mesh
                geometry={nodes.Legs01Left.geometry}
                material={materials.Metal}
                position={[-1.5, 0, 0]}
                castShadow
                ref={leftLegs}
              />
              <mesh
                geometry={nodes.Legs01Right.geometry}
                material={materials.Metal}
                position={[1.5, 0, 0]}
                castShadow
                ref={rightLegs}
              />
            </>
          )}

          {legs === 1 && (
            <>
              <mesh
                geometry={nodes.Legs02Left.geometry}
                material={materials.Metal}
                position={[-1.5, 0, 0]}
                castShadow
                ref={leftLegs}
              />
              <mesh
                geometry={nodes.Legs02Right.geometry}
                material={materials.Metal}
                position={[1.5, 0, 0]}
                castShadow
                ref={rightLegs}
              />
            </>
          )}

          {legs === 2 && (
            <>
              {" "}
              <mesh
                geometry={nodes.Legs03Left.geometry}
                material={materials.Metal}
                position={[-1.5, 0, 0]}
                castShadow
                ref={leftLegs}
              />
              <mesh
                geometry={nodes.Legs03Right.geometry}
                material={materials.Metal}
                position={[1.5, 0, 0]}
                castShadow
                ref={rightLegs}
              />
            </>
          )}
        </group>
      </Stage>
    </>
  );
}

useGLTF.preload("./models/Table.gltf");
