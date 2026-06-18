import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Original interpretation of the publicly documented Amaravati plan:
 * Krishna riverfront to the north · a central government spine · the Inner
 * Ring Road loop · an orthogonal capital grid with a CBD density gradient.
 * Deliberately NOT Foster + Partners' design or any official artwork.
 */
export function CityTwin({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeef1f5, 0.02);
    const cam = new THREE.PerspectiveCamera(52, host.clientWidth / host.clientHeight, 0.1, 400);
    cam.position.set(0, 26, 52);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x9aa2b0, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(20, 40, 18);
    scene.add(key);
    const rim = new THREE.PointLight(0x138808, 0.6, 160);
    rim.position.set(-30, 22, -20);
    scene.add(rim);
    const az = new THREE.PointLight(0x1d4ed8, 0.55, 140);
    az.position.set(34, 16, 18);
    scene.add(az);

    const city = new THREE.Group();
    scene.add(city);
    const grid = new THREE.GridHelper(180, 48, 0x8fb6d6, 0xd8dee7);
    (grid.material as THREE.Material).opacity = 0.16;
    (grid.material as THREE.Material).transparent = true;
    city.add(grid);

    const EM = 0x138808;
    const AZ = 0x1d4ed8;
    const GLASS = 0xc3d6ea;
    const glassMat = () =>
      new THREE.MeshStandardMaterial({
        color: GLASS,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.1,
        emissive: GLASS,
        emissiveIntensity: 0.06,
        depthWrite: false,
      });
    const addGlass = (geo: THREE.BufferGeometry, x: number, y: number, z: number, edge: number) => {
      const m = new THREE.Mesh(geo, glassMat());
      m.position.set(x, y, z);
      city.add(m);
      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo),
        new THREE.LineBasicMaterial({ color: edge, transparent: true, opacity: 0.5 }),
      );
      e.position.set(x, y, z);
      city.add(e);
    };

    const RIVER_Z = -58;
    const SPINE_HALF = 4;
    const IRR_R = 40;
    const IRR_BAND = 3.6;
    const nodes: { m: THREE.Mesh; base: number; ph: number }[] = [];
    const N = 15;
    const gap = 8.5;
    for (let x = 0; x < N; x++)
      for (let z = 0; z < N; z++) {
        const cx = (x - (N - 1) / 2) * gap;
        const cz = (z - (N - 1) / 2) * gap;
        if (cz < RIVER_Z + 9) continue;
        const dist = Math.hypot(cx, cz);
        if (dist > 74) continue;
        if (Math.abs(cx) < SPINE_HALF) continue;
        if (Math.abs(dist - IRR_R) < IRR_BAND) continue;
        const core = 1 - Math.min(1, dist / 72);
        const tall = Math.max(2, core * 28 * (0.5 + Math.random() * 0.7));
        const w = 3.8 + Math.random() * 2.2;
        addGlass(new THREE.BoxGeometry(w, tall, w), cx, tall / 2, cz, (x + z) % 2 ? EM : AZ);
        if (core > 0.5 && tall > 15 && Math.random() > 0.62) {
          const nd = new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 12), new THREE.MeshBasicMaterial({ color: EM }));
          nd.position.set(cx, tall + 2.4, cz);
          city.add(nd);
          nodes.push({ m: nd, base: tall + 2.4, ph: Math.random() * 6.28 });
        }
      }

    for (let i = 0; i < 5; i++) {
      const gx = (i - 2) * 5.2;
      const gz = RIVER_Z + 22;
      const gh = 22 + (2 - Math.abs(i - 2)) * 7;
      addGlass(new THREE.BoxGeometry(6, gh, 8), gx, gh / 2, gz, i === 2 ? EM : AZ);
    }

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(IRR_R - 0.5, IRR_R + 0.5, 100),
      new THREE.MeshBasicMaterial({ color: AZ, transparent: true, opacity: 0.22, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.12;
    city.add(ring);

    const spine = new THREE.Mesh(
      new THREE.PlaneGeometry(SPINE_HALF * 2 - 1.5, 118),
      new THREE.MeshBasicMaterial({ color: EM, transparent: true, opacity: 0.15, side: THREE.DoubleSide }),
    );
    spine.rotation.x = -Math.PI / 2;
    spine.position.set(0, 0.1, -4);
    city.add(spine);

    const riverGeo = new THREE.PlaneGeometry(180, 16, 72, 1);
    const riverMat = new THREE.MeshStandardMaterial({
      color: AZ,
      emissive: AZ,
      emissiveIntensity: 0.12,
      roughness: 0.5,
      metalness: 0.2,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.15, RIVER_Z);
    city.add(river);
    const rPos = riverGeo.attributes.position as THREE.BufferAttribute;
    const rBase = (rPos.array as Float32Array).slice();

    const pc = reduce ? 260 : 760;
    const pGeo = new THREE.BufferGeometry();
    const arr = new Float32Array(pc * 3);
    for (let i = 0; i < pc; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 180;
      arr[i * 3 + 1] = Math.random() * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ color: 0x2a3346, size: 0.3, transparent: true, opacity: 0.2, depthWrite: false }),
    );
    scene.add(points);

    let tx = 0;
    let ty = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    };
    addEventListener("pointermove", onMove, { passive: true });

    let t = 0;
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      t += 0.006;
      mx += (tx - mx) * 0.04;
      my += (ty - my) * 0.04;
      const rad = 58;
      const ang = reduce ? 0.6 : t * 0.12;
      cam.position.x = Math.sin(ang) * rad + mx * 16;
      cam.position.z = Math.cos(ang) * rad;
      cam.position.y = 26 - my * 10;
      cam.lookAt(0, 8, 0);
      for (let i = 0; i < rPos.count; i++) {
        const ix = i * 3;
        (rPos.array as Float32Array)[ix + 2] = rBase[ix + 2] + Math.sin(t * 3 + rBase[ix] * 0.25) * 0.7;
      }
      rPos.needsUpdate = true;
      riverMat.emissiveIntensity = 0.42 + Math.sin(t * 2) * 0.12;
      nodes.forEach((n) => {
        n.m.position.y = n.base + Math.sin(t * 2.4 + n.ph) * 0.9;
      });
      points.rotation.y = t * 0.04;
      const pa = pGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < pa.length; i += 3) {
        pa[i] += 0.02;
        if (pa[i] > 60) pa[i] = 0;
      }
      pGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, cam);
    };
    loop();

    const onResize = () => {
      if (!host) return;
      cam.aspect = host.clientWidth / host.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    addEventListener("resize", onResize, { passive: true });
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else loop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
