import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const base = import.meta.env.BASE_URL;

// Skills with color themes and optional logo images
const skillsConfig: { name: string; colors: [string, string, string]; logo?: string }[] = [
  { name: "Java", colors: ["#f89820", "#5382a1", "#ed2025"], logo: undefined },
  { name: "C++", colors: ["#00599c", "#004482", "#659bd3"] },
  { name: "Spring Boot", colors: ["#6db33f", "#4a8c2a", "#8fd46b"] },
  { name: "REST APIs", colors: ["#00bcd4", "#0097a7", "#4dd0e1"] },
  { name: "Microservices", colors: ["#9c27b0", "#7b1fa2", "#ce93d8"] },
  { name: "Apache Kafka", colors: ["#231f20", "#5a5a5a", "#ffffff"] },
  { name: "MySQL", colors: ["#00758f", "#f29111", "#00618a"], logo: `${base}images/mysql.webp` },
  { name: "MongoDB", colors: ["#4db33d", "#3fa037", "#d4f5ce"], logo: `${base}images/mongo.webp` },
  { name: "Kubernetes", colors: ["#326ce5", "#2156c9", "#6d9ef5"] },
  { name: "Docker", colors: ["#2496ed", "#1a7bc2", "#60b5f5"] },
  { name: "AWS", colors: ["#ff9900", "#232f3e", "#ffcc80"] },
  { name: "Jenkins", colors: ["#d33833", "#ef3330", "#f5a9a9"] },
  { name: "CI/CD", colors: ["#43a047", "#2e7d32", "#81c784"] },
  { name: "GitLab", colors: ["#fc6d26", "#e24329", "#fca326"] },
  { name: "Git", colors: ["#f05032", "#de4c36", "#f59882"] },
  { name: "Postman", colors: ["#ff6c37", "#e85a2a", "#ffab91"] },
  { name: "Maven", colors: ["#c71a36", "#a0132a", "#f06292"] },
  { name: "JUnit", colors: ["#25a162", "#1b7d4b", "#66bb6a"] },
  { name: "Selenium", colors: ["#43b02a", "#2d8c1f", "#81c784"] },
  { name: "Playwright", colors: ["#2ead33", "#45d04b", "#1b8e20"] },
  { name: "API Testing", colors: ["#ff7043", "#e64a19", "#ffab91"] },
  { name: "Rest Assured", colors: ["#4caf50", "#388e3c", "#a5d6a7"] },
  { name: "Appium", colors: ["#662d91", "#4a1a6b", "#b388ff"] },
  { name: "SDET", colors: ["#1976d2", "#1565c0", "#64b5f6"] },
  { name: "Splunk", colors: ["#65a637", "#4d8c2a", "#aed581"] },
  { name: "Jira", colors: ["#0052cc", "#2684ff", "#4c9aff"] },
  { name: "Confluence", colors: ["#0052cc", "#1a73e8", "#4c9aff"] },
  { name: "Agile", colors: ["#ff6f00", "#e65100", "#ffcc02"] },
  { name: "IntelliJ IDEA", colors: ["#fe315d", "#9c27b0", "#536dfe"] },
  { name: "SDLC", colors: ["#00897b", "#00695c", "#80cbc4"] },
  { name: "Software Dev", colors: ["#5c6bc0", "#3f51b5", "#9fa8da"] },
  { name: "JavaScript", colors: ["#f7df1e", "#d4c21a", "#323330"], logo: `${base}images/javascript.webp` },
  { name: "TypeScript", colors: ["#3178c6", "#235a9e", "#79b8ff"], logo: `${base}images/typescript.webp` },
  { name: "React", colors: ["#61dafb", "#21a1c9", "#282c34"], logo: `${base}images/react2.webp` },
  { name: "Node.js", colors: ["#339933", "#215c21", "#68a063"], logo: `${base}images/node2.webp` },
  { name: "Linux", colors: ["#fcc624", "#333333", "#fdd835"] },
  { name: "Windows/Unix", colors: ["#00adef", "#0078d7", "#4fc3f7"] },
];

const textureLoader = new THREE.TextureLoader();

function createSkillTexture(
  skill: string,
  colors: [string, string, string],
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Draw colorful sphere gradient
  const gradient = ctx.createRadialGradient(220, 200, 30, 256, 256, 280);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.3, colors[0]);
  gradient.addColorStop(0.7, colors[1]);
  gradient.addColorStop(1, colors[2]);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(256, 256, 256, 0, Math.PI * 2);
  ctx.fill();

  // Determine text color for contrast
  const bgBrightness = getBrightness(colors[0]);
  const textColor = bgBrightness > 160 ? "#1a1a2e" : "#ffffff";

  // Draw skill name with shadow for readability
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let fontSize = 68;
  if (skill.length > 12) fontSize = 48;
  else if (skill.length > 8) fontSize = 56;

  ctx.font = `bold ${fontSize}px 'Segoe UI', Arial, sans-serif`;

  // Text shadow
  ctx.shadowColor = "rgba(0,0,0,0.5)";
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = textColor;
  ctx.fillText(skill, 256, 256, 440);

  // Reset shadow and draw again for crispness
  ctx.shadowColor = "transparent";
  ctx.fillText(skill, 256, 256, 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function getBrightness(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const materials = useMemo(() => {
    return skillsConfig.map((skill) => {
      if (skill.logo) {
        // Use the existing logo image
        const texture = textureLoader.load(skill.logo);
        texture.colorSpace = THREE.SRGBColorSpace;
        return new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        });
      }
      // Generate colorful canvas texture with skill name
      const texture = createSkillTexture(skill.name, skill.colors);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.3,
        metalness: 0.5,
        roughness: 1,
        clearcoat: 0.1,
      });
    });
  }, []);

  const spheres = useMemo(() => {
    return skillsConfig.map((_skill, i) => ({
      scale: [0.7, 1, 0.8, 1, 0.9][i % 5],
      materialIndex: i,
    }));
  }, []);

  return (
    <div className="techstack">
      <h2> My Techstack</h2>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              material={materials[props.materialIndex]}
              isActive={isActive}
            />
          ))}
        </Physics>
        <Environment
          files={`${base}models/char_enviorment.hdr`}
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
