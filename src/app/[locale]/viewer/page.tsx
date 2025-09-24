"use client";
// 中文注释：初始三维预览占位（Equirectangular 360 全景作为球体内壁纹理）
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function EquirectSphere({ src }: { src?: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = src ? new THREE.TextureLoader().load(src) : null as any;
  if (texture) texture.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh ref={mesh} scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 64, 64]} />
      <meshBasicMaterial color={texture ? undefined : "#222"} map={texture || undefined} side={THREE.BackSide} />
    </mesh>
  );
}

export default function ViewerPage() {
  // TODO: 后续替换为用户上传的 360 图像/VR 切片数据
  const placeholder = undefined; // 可替换为 equirect 图
  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <EquirectSphere src={placeholder} />
      </Canvas>
    </div>
  );
}
