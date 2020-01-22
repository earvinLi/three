// External Dependencies
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import * as Three from 'three';

// Local Variables
const styles = {
  rootStyle: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
};

// Component Definition
const App = () => {
  const mount = useRef(null);
  const [isAnimating, setAnimating] = useState(true);
  const controls = useRef(null);

  useEffect(() => {
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    let frameId;

    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({ color: '#4AA3DF' });
    const cubeOne = new Three.Mesh(geometry, material);
    const cubeTwo = new Three.Mesh(geometry, material);

    camera.position.z = 4;
    scene.add(cubeOne);
    scene.add(cubeTwo);
    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    const renderScene = () => renderer.render(scene, camera);
    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };
    const animate = () => {
      cubeOne.rotation.x += 0.01;
      cubeOne.rotation.y += 0.01;
      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frameId) frameId = requestAnimationFrame(animate);
    };
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    mount.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);

    start();
    controls.current = { start, stop };

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      mount.current.removeChild(renderer.domElement);
      scene.remove(cubeOne);
      scene.remove(cubeTwo);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useEffect(() => {
    if (isAnimating) return controls.current.start();
    controls.current.stop();
  }, [isAnimating])

  return (
    <div
      style={styles.rootStyle}
      onClick={() => setAnimating(!isAnimating)}
      ref={mount}
    />
  );
};

export default App;
