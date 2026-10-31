import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Volume2, Eye, Shield, RotateCcw, Maximize2, Compass } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export default function ThreeVRScene({
  environmentType = 'room',
  characterSetup = {},
  scenarioTitle = 'Safety Scenario',
  narratorPrompt = '',
  guidanceTip = '',
  isStereoVR = false,
  onActionTrigger = null,
  bubbleRadius = 1.4,
  onBubbleRadiusChange = null
}) {
  const mountRef = useRef(null);
  const { speak, ttsEnabled } = useAccessibility();

  const [cameraMode, setCameraMode] = useState('third_person'); // 'third_person' | 'first_person'
  const [bubbleColorState, setBubbleColorState] = useState('safe'); // 'safe' | 'warning' | 'alert'
  const [distanceDisplay, setDistanceDisplay] = useState('2.5m');
  const [isAnimatingAction, setIsAnimatingAction] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const bubbleMeshRef = useRef(null);
  const partnerGroupRef = useRef(null);
  const learnerGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const partnerArmRef = useRef(null);
  const learnerArmRef = useRef(null);

  // Initial prompt speech
  useEffect(() => {
    if (narratorPrompt && ttsEnabled) {
      speak(`${scenarioTitle}. ${narratorPrompt}`);
    }
  }, [scenarioTitle, narratorPrompt]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.8);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    dirLight.position.set(4, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Warm accent point light
    const pointLight = new THREE.PointLight(0x38bdf8, 0.8, 10);
    pointLight.position.set(-2, 3, 2);
    scene.add(pointLight);

    // 5. Build Environment
    buildEnvironment(scene, environmentType);

    // 6. Build Learner Avatar at (0, 0, 0)
    const learnerGroup = createAvatar({
      shirtColor: 0x0284c7, // Vibrant friendly blue
      pantsColor: 0x1e293b,
      skinColor: 0xfbd2a8,
      hairColor: 0x332014,
      isLearner: true
    });
    learnerGroup.position.set(0, 0, 0);
    scene.add(learnerGroup);
    learnerGroupRef.current = learnerGroup;

    // 7. Build Interaction Partner
    const partnerPosition = characterSetup.otherPosition || [2.2, 0, 0];
    const partnerGroup = createAvatar({
      shirtColor: getPartnerShirtColor(characterSetup.otherRole),
      pantsColor: 0x334155,
      skinColor: 0xf8d7b8,
      hairColor: 0x5a3825,
      isLearner: false
    });
    partnerGroup.position.set(partnerPosition[0], partnerPosition[1], partnerPosition[2]);
    // Turn partner to face learner
    partnerGroup.lookAt(0, partnerGroup.position.y, 0);
    scene.add(partnerGroup);
    partnerGroupRef.current = partnerGroup;

    // Extract arms for gesture animation
    partnerArmRef.current = partnerGroup.userData.rightArm;
    learnerArmRef.current = learnerGroup.userData.rightArm;

    // 8. Build 3D Personal Boundary Bubble (Translucent glowing sphere)
    const bubbleGeo = new THREE.SphereGeometry(bubbleRadius, 32, 32);
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.28,
      roughness: 0.1,
      metalness: 0.1,
      wireframe: false,
      depthWrite: false
    });
    const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
    bubbleMesh.position.set(0, 1.1, 0);
    scene.add(bubbleMesh);
    bubbleMeshRef.current = bubbleMesh;

    // 9. Floor Distance Circles (1m, 2m, 3m)
    [1.0, bubbleRadius, 2.5, 3.5].forEach((rad, idx) => {
      const ringGeo = new THREE.RingGeometry(rad - 0.02, rad + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 1 ? 0x22c55e : 0x64748b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: idx === 1 ? 0.6 : 0.25
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01 + idx * 0.001;
      scene.add(ring);
    });

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating/breathing animation for avatars
      if (learnerGroupRef.current) {
        learnerGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.02;
      }
      if (partnerGroupRef.current) {
        partnerGroupRef.current.position.y = Math.sin(elapsedTime * 2 + 1) * 0.02;

        // Perform gesture based on action
        const action = characterSetup.action || 'standing_friendly';
        if (action === 'raising_hand_high_five' && partnerArmRef.current) {
          partnerArmRef.current.rotation.x = -Math.PI / 2 - 0.3 + Math.sin(elapsedTime * 3) * 0.1;
        } else if (action === 'asking_permission_open_arms' && partnerArmRef.current) {
          partnerArmRef.current.rotation.z = -0.7 + Math.sin(elapsedTime * 2) * 0.08;
        } else if (action === 'whispering_secret' && partnerArmRef.current) {
          partnerArmRef.current.rotation.x = -1.2;
        }
      }

      // Bubble subtle pulse animation
      if (bubbleMeshRef.current) {
        const pulse = 1 + Math.sin(elapsedTime * 2.5) * 0.03;
        bubbleMeshRef.current.scale.set(pulse, pulse, pulse);

        // Calculate distance between learner and partner
        if (partnerGroupRef.current) {
          const dist = partnerGroupRef.current.position.distanceTo(learnerGroupRef.current.position);
          setDistanceDisplay(`${dist.toFixed(1)}m`);

          // Update bubble color based on boundary state
          if (dist > bubbleRadius) {
            bubbleMat.color.setHex(0x22c55e); // Safe Green
            bubbleMat.opacity = 0.28;
            setBubbleColorState('safe');
          } else if (dist > bubbleRadius * 0.8) {
            bubbleMat.color.setHex(0xf59e0b); // Warning Amber
            bubbleMat.opacity = 0.38;
            setBubbleColorState('warning');
          } else {
            bubbleMat.color.setHex(0xef4444); // Alert Red
            bubbleMat.opacity = 0.45;
            setBubbleColorState('alert');
          }
        }
      }

      // Render stereo VR or single perspective
      if (isStereoVR) {
        renderStereo(renderer, scene, camera);
      } else {
        renderer.render(scene, camera);
      }
    };

    animate();

    // 11. Mouse / Touch Orbit Interaction
    const handleMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      cameraAngle += deltaX * 0.006;
      prevMousePos = { x: e.clientX, y: e.clientY };

      if (cameraMode === 'third_person') {
        const radius = 4.8;
        camera.position.x = Math.sin(cameraAngle) * radius;
        camera.position.z = Math.cos(cameraAngle) * radius;
        camera.lookAt(0, 1.1, 0);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      renderer.dispose();
    };
  }, [environmentType, characterSetup, isStereoVR, bubbleRadius]);

  // Adjust camera when cameraMode changes
  useEffect(() => {
    if (!cameraRef.current) return;
    if (cameraMode === 'first_person') {
      cameraRef.current.position.set(0, 1.45, 0.1);
      cameraRef.current.lookAt(
        characterSetup.otherPosition?.[0] || 2.2,
        1.3,
        characterSetup.otherPosition?.[2] || 0
      );
    } else {
      cameraRef.current.position.set(0, 2.5, 4.8);
      cameraRef.current.lookAt(0, 1.1, 0);
    }
  }, [cameraMode, characterSetup]);

  // Interactive Action Triggers: Learner Steps Back or Sets Up Shield
  const triggerLearnerStepBack = () => {
    if (!partnerGroupRef.current || isAnimatingAction) return;
    setIsAnimatingAction(true);

    const startX = partnerGroupRef.current.position.x;
    const targetX = startX > 0 ? startX + 0.8 : startX - 0.8;

    let progress = 0;
    const stepInterval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        partnerGroupRef.current.position.x = targetX;
        clearInterval(stepInterval);
        setIsAnimatingAction(false);
      } else {
        partnerGroupRef.current.position.x = startX + (targetX - startX) * progress;
      }
    }, 20);

    speak('You took a step back and created safe personal space. Great job!');
  };

  const triggerSafeWave = () => {
    if (learnerArmRef.current) {
      learnerArmRef.current.rotation.x = -Math.PI / 2;
      speak('Hello! We can communicate with words and friendly waves.');
      setTimeout(() => {
        if (learnerArmRef.current) learnerArmRef.current.rotation.x = 0;
      }, 1500);
    }
  };

  return (
    <div className="card" style={{ padding: '0.75rem', position: 'relative' }}>
      {/* 3D VR Viewport */}
      <div ref={mountRef} className="vr-canvas-wrapper" style={{ cursor: 'grab' }} />

      {/* Floating HUD Badges & Scene Info */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none'
        }}
      >
        <div
          className="badge"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            padding: '0.4rem 0.85rem',
            fontSize: '0.9em',
            border: '1px solid var(--border-color)'
          }}
        >
          <Compass size={16} color="#38bdf8" />
          <span>Environment: {capitalize(environmentType)}</span>
        </div>

        <div
          className="badge"
          style={{
            background:
              bubbleColorState === 'safe'
                ? 'rgba(34, 197, 94, 0.9)'
                : bubbleColorState === 'warning'
                ? 'rgba(245, 158, 11, 0.9)'
                : 'rgba(239, 68, 68, 0.9)',
            color: '#000',
            fontWeight: 700,
            padding: '0.4rem 0.85rem',
            fontSize: '0.9em'
          }}
        >
          <Shield size={16} />
          <span>
            {bubbleColorState === 'safe' && 'Boundary Safe'}
            {bubbleColorState === 'warning' && 'Approaching Boundary'}
            {bubbleColorState === 'alert' && 'Inside Boundary Bubble'}
          </span>
          <span style={{ marginLeft: '0.25rem', opacity: 0.85 }}>({distanceDisplay})</span>
        </div>
      </div>

      {/* Floating View Controls Toolbar */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          gap: '0.5rem',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '0.35rem 0.6rem',
          borderRadius: 'var(--border-radius-sm)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)'
        }}
      >
        <button
          className="btn btn-outline"
          style={{ minHeight: '36px', padding: '0.3rem 0.6rem', fontSize: '0.85em' }}
          onClick={() => setCameraMode(cameraMode === 'third_person' ? 'first_person' : 'third_person')}
          title="Toggle 1st Person / 3rd Person POV"
          aria-label="Toggle camera view"
        >
          <Eye size={16} />
          <span>{cameraMode === 'third_person' ? '1st Person POV' : '3rd Person POV'}</span>
        </button>

        {narratorPrompt && (
          <button
            className="btn btn-primary"
            style={{ minHeight: '36px', padding: '0.3rem 0.6rem', fontSize: '0.85em' }}
            onClick={() => speak(`${scenarioTitle}. ${narratorPrompt}`)}
            title="Read Prompt Aloud"
            aria-label="Read scenario prompt aloud"
          >
            <Volume2 size={16} />
            <span>Read Aloud</span>
          </button>
        )}
      </div>

      {/* In-Scene Interactive Practice Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginTop: '0.75rem',
          padding: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-outline"
            style={{ minHeight: '44px', fontSize: '0.9em' }}
            onClick={triggerLearnerStepBack}
            disabled={isAnimatingAction}
          >
            <RotateCcw size={16} />
            <span>Practice: "Take A Step Back"</span>
          </button>

          <button
            className="btn btn-outline"
            style={{ minHeight: '44px', fontSize: '0.9em' }}
            onClick={triggerSafeWave}
          >
            <Shield size={16} />
            <span>Practice: "Friendly Wave"</span>
          </button>
        </div>

        {/* Bubble Radius Slider for Visual Learners */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>Bubble Radius:</span>
          <input
            type="range"
            min="0.8"
            max="2.5"
            step="0.1"
            value={bubbleRadius}
            onChange={(e) => onBubbleRadiusChange && onBubbleRadiusChange(parseFloat(e.target.value))}
            style={{ width: '100px', cursor: 'pointer' }}
            aria-label="Adjust personal boundary bubble radius"
          />
          <span style={{ fontSize: '0.85em', fontWeight: 600 }}>{bubbleRadius}m</span>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// Three.js Procedural Builders
// --------------------------------------------------------------------------

function buildEnvironment(scene, type) {
  // Ground plane
  let floorColor = 0x334155;
  if (type === 'school') floorColor = 0x223344;
  if (type === 'home') floorColor = 0x3d3025; // Warm wood

  const floorGeo = new THREE.PlaneGeometry(16, 16);
  const floorMat = new THREE.MeshStandardMaterial({
    color: floorColor,
    roughness: 0.6,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Background wall
  const wallGeo = new THREE.PlaneGeometry(16, 8);
  const wallMat = new THREE.MeshStandardMaterial({
    color: type === 'school' ? 0x1e293b : 0x0f172a,
    roughness: 0.8
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0, 4, -4);
  scene.add(wall);

  // Classroom blackboard / Home banner
  const boardGeo = new THREE.BoxGeometry(4.5, 2.2, 0.1);
  const boardMat = new THREE.MeshStandardMaterial({
    color: type === 'school' ? 0x14532d : 0x1e3a5f
  });
  const board = new THREE.Mesh(boardGeo, boardMat);
  board.position.set(0, 4.2, -3.94);
  scene.add(board);

  // Friendly decorative elements: Desk / Side Table
  const deskGeo = new THREE.BoxGeometry(1.6, 0.8, 0.9);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.set(-3.2, 0.4, -1.8);
  desk.castShadow = true;
  desk.receiveShadow = true;
  scene.add(desk);

  // Indoor plant on desk
  const potGeo = new THREE.CylinderGeometry(0.2, 0.15, 0.35, 16);
  const potMat = new THREE.MeshStandardMaterial({ color: 0xc2410c });
  const pot = new THREE.Mesh(potGeo, potMat);
  pot.position.set(-3.2, 0.98, -1.8);
  scene.add(pot);

  const leavesGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const leavesMat = new THREE.MeshStandardMaterial({ color: 0x16a34a });
  const leaves = new THREE.Mesh(leavesGeo, leavesMat);
  leaves.position.set(-3.2, 1.3, -1.8);
  scene.add(leaves);
}

function createAvatar({ shirtColor, pantsColor, skinColor, hairColor, isLearner }) {
  const group = new THREE.Group();

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.75, 16);
  const torsoMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.5 });
  const torso = new THREE.Mesh(torsoGeo, torsoMat);
  torso.position.y = 1.05;
  torso.castShadow = true;
  group.add(torso);

  // Head
  const headGeo = new THREE.SphereGeometry(0.24, 24, 24);
  const headMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.6 });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.62;
  head.castShadow = true;
  group.add(head);

  // Hair
  const hairGeo = new THREE.SphereGeometry(0.25, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.8 });
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.y = 1.68;
  group.add(hair);

  // Eyes (Stylized friendly dots)
  const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(0.08, 1.63, 0.22);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(-0.08, 1.63, 0.22);
  group.add(rightEye);

  // Gentle Smile
  const smileGeo = new THREE.TorusGeometry(0.06, 0.015, 8, 16, Math.PI);
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x991b1b });
  const smile = new THREE.Mesh(smileGeo, smileMat);
  smile.position.set(0, 1.54, 0.22);
  smile.rotation.x = Math.PI;
  group.add(smile);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.68, 12);
  const legMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.7 });

  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(0.12, 0.35, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(-0.12, 0.35, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  // Right Arm (for gestures)
  const armGroup = new THREE.Group();
  armGroup.position.set(0.36, 1.35, 0);

  const armGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.55, 12);
  const armMat = new THREE.MeshStandardMaterial({ color: shirtColor });
  const armMesh = new THREE.Mesh(armGeo, armMat);
  armMesh.position.y = -0.25;
  armMesh.castShadow = true;
  armGroup.add(armMesh);

  // Hand
  const handGeo = new THREE.SphereGeometry(0.07, 12, 12);
  const handMat = new THREE.MeshStandardMaterial({ color: skinColor });
  const hand = new THREE.Mesh(handGeo, handMat);
  hand.position.y = -0.55;
  armGroup.add(hand);

  group.add(armGroup);
  group.userData.rightArm = armGroup;

  // Left Arm
  const leftArm = new THREE.Mesh(armGeo, armMat);
  leftArm.position.set(-0.36, 1.1, 0);
  leftArm.castShadow = true;
  group.add(leftArm);

  return group;
}

function getPartnerShirtColor(role) {
  switch (role) {
    case 'Teacher':
      return 0x059669; // Emerald green
    case 'Family Caregiver':
      return 0xd97706; // Warm amber
    case 'Classmate':
    case 'Peer':
      return 0x8b5cf6; // Purple
    default:
      return 0x475569; // Slate
  }
}

function renderStereo(renderer, scene, camera) {
  const size = renderer.getSize(new THREE.Vector2());
  const halfWidth = size.x / 2;

  // Left eye
  renderer.setViewport(0, 0, halfWidth, size.y);
  renderer.setScissor(0, 0, halfWidth, size.y);
  renderer.setScissorTest(true);
  camera.position.x -= 0.04;
  renderer.render(scene, camera);

  // Right eye
  renderer.setViewport(halfWidth, 0, halfWidth, size.y);
  renderer.setScissor(halfWidth, 0, halfWidth, size.y);
  camera.position.x += 0.08;
  renderer.render(scene, camera);

  // Restore
  camera.position.x -= 0.04;
  renderer.setScissorTest(false);
}

function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
