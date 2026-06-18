import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Digital Aurora — an interactive volumetric WebGL aurora hero.
 * Recoloured to the data.amaravati identity (emerald → azure → gold over a
 * deep navy) and hardened for production: typed, WebGL fallback,
 * prefers-reduced-motion aware, and paused while the tab is hidden.
 */

export interface AuroraCta {
  text: string;
  href: string;
  primary?: boolean;
}

export interface AuroraHeroProps {
  title: ReactNode;
  description: ReactNode;
  badgeText?: string;
  badgeLabel?: string;
  ctaButtons?: AuroraCta[];
  microDetails?: string[];
}

// ===================== HERO COMPONENT =====================
const AuroraHero = ({
  title,
  description,
  badgeText,
  badgeLabel,
  ctaButtons = [],
  microDetails = [],
}: AuroraHeroProps) => {
  return (
    <section className="relative h-dvh w-full overflow-hidden">
      <ShaderBackground />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 pb-24 pt-36 sm:gap-8 sm:pt-44 md:px-10 lg:px-16">
        {badgeText && badgeLabel && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/70">
              {badgeLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span className="text-xs font-light tracking-tight text-white/80">{badgeText}</span>
          </div>
        )}

        <h1 className="max-w-3xl text-balance text-left font-serif text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          {title}
        </h1>

        <p className="max-w-xl text-left text-base font-light leading-relaxed tracking-tight text-white/75 sm:text-lg">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {ctaButtons.map((button, index) => {
            const cls = `rounded-2xl border px-5 py-3 text-sm font-medium tracking-tight transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 ${
              button.primary
                ? "border-white/15 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "border-white/10 text-white/80 hover:bg-white/5"
            }`;
            return button.href.startsWith("/") ? (
              <Link key={index} to={button.href} className={cls}>
                {button.text}
              </Link>
            ) : (
              <a key={index} href={button.href} className={cls}>
                {button.text}
              </a>
            );
          })}
        </div>

        <ul className="mt-8 flex flex-wrap gap-6 text-xs font-light tracking-tight text-white/60">
          {microDetails.map((detail, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-white/40" /> {detail}
            </li>
          ))}
        </ul>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
};

// ===================== SHADER BACKGROUND =====================
const ShaderBackground = () => {
  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#05070e]" aria-hidden>
      <InteractiveShader flowSpeed={0.4} colorIntensity={1.25} noiseLayers={4.0} mouseInfluence={0.3} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#05070e]/40 via-transparent to-[#05070e]/30" />
    </div>
  );
};

// ===================== FALLBACK (no WebGL) =====================
const FallbackBackground = () => (
  <div
    aria-hidden
    className="absolute inset-0 z-0 h-full w-full bg-[#05070e]"
    style={{
      backgroundImage:
        "radial-gradient(60% 50% at 25% 20%, rgba(16,160,106,0.28), transparent 60%), radial-gradient(55% 55% at 80% 30%, rgba(37,99,235,0.30), transparent 62%), radial-gradient(45% 45% at 60% 90%, rgba(231,196,107,0.14), transparent 60%)",
    }}
  />
);

// ===================== SHADER COMPONENT =====================
interface ShaderProps {
  flowSpeed?: number;
  colorIntensity?: number;
  noiseLayers?: number;
  mouseInfluence?: number;
}

const InteractiveShader = ({
  flowSpeed = 0.4,
  colorIntensity = 1.2,
  noiseLayers = 4.0,
  mouseInfluence = 0.3,
}: ShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      setFailed(true);
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
    `;

    // data.amaravati identity: emerald -> azure aurora with gold glints over navy.
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float uFlowSpeed;
      uniform float uColorIntensity;
      uniform float uNoiseLayers;
      uniform float uMouseInfluence;

      #define MARCH_STEPS 32

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }

      float fbm(vec3 p) {
          float f = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 8; i++) {
              if (float(i) >= uNoiseLayers) break;
              f += amp * hash(p.xy);
              p *= 2.0;
              amp *= 0.5;
          }
          return f;
      }

      float map(vec3 p) {
          vec3 q = p;
          q.z += iTime * uFlowSpeed;
          vec2 mouse = (iMouse.xy / iResolution.xy - 0.5) * 2.0;
          q.xy += mouse * uMouseInfluence;
          float f = fbm(q * 2.0);
          f *= sin(p.y * 2.0 + iTime) * 0.5 + 0.5;
          return clamp(f, 0.0, 1.0);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
        vec3 ro = vec3(0, -1, 0);
        vec3 rd = normalize(vec3(uv, 1.0));
        vec3 col = vec3(0.02, 0.03, 0.07); // deep navy base
        float t = 0.0;

        vec3 emerald = vec3(0.05, 0.50, 0.32);
        vec3 azure   = vec3(0.11, 0.30, 0.95);
        vec3 gold    = vec3(0.91, 0.77, 0.42);

        for (int i = 0; i < MARCH_STEPS; i++) {
            vec3 p = ro + rd * t;
            float density = map(p);
            if (density > 0.0) {
                float ph = 0.5 + 0.5 * sin(iTime * 0.4 + p.y * 2.0 + p.x);
                vec3 auroraColor = mix(emerald, azure, ph) + gold * pow(density, 2.0) * 0.25;
                col += auroraColor * density * 0.12 * uColorIntensity;
            }
            t += 0.1;
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      setFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setFailed(true);
      return;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uFlowSpeedLocation = gl.getUniformLocation(program, "uFlowSpeed");
    const uColorIntensityLocation = gl.getUniformLocation(program, "uColorIntensity");
    const uNoiseLayersLocation = gl.getUniformLocation(program, "uNoiseLayers");
    const uMouseInfluenceLocation = gl.getUniformLocation(program, "uMouseInfluence");

    const startTime = performance.now();
    let animationFrameId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    if (!reduce) window.addEventListener("mousemove", handleMouseMove);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(iResolutionLocation, gl.canvas.width, gl.canvas.height);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const draw = (timeSec: number) => {
      if (gl.isContextLost()) return;
      gl.uniform1f(iTimeLocation, timeSec);
      gl.uniform2f(
        iMouseLocation,
        mousePos.current.x * canvas.width,
        (1.0 - mousePos.current.y) * canvas.height,
      );
      gl.uniform1f(uFlowSpeedLocation, flowSpeed);
      gl.uniform1f(uColorIntensityLocation, colorIntensity);
      gl.uniform1f(uNoiseLayersLocation, noiseLayers);
      gl.uniform1f(uMouseInfluenceLocation, mouseInfluence);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const renderLoop = () => {
      draw((performance.now() - startTime) / 1000.0);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    if (reduce) {
      draw(3.2); // a single, pleasing static frame
    } else {
      renderLoop();
    }

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) cancelAnimationFrame(animationFrameId);
      else renderLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      if (!gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, [flowSpeed, colorIntensity, noiseLayers, mouseInfluence]);

  if (failed) return <FallbackBackground />;
  return <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full" />;
};

export default AuroraHero;
