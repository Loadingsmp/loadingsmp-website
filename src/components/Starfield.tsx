import { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
    }

    interface Orb {
      x: number;
      y: number;
      radius: number;
      hue: number;
      saturation: number;
      speed: number;
      phase: number;
      driftX: number;
      driftY: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      hue: number;
    }

    let stars: Star[] = [];
    let orbs: Orb[] = [];
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      initElements();
    };

    const initElements = () => {
      const area = canvas.width * canvas.height;

      const starCount = Math.floor(area / 15000);
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.2,
        opacity: Math.random() * 0.35 + 0.05,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.012 + 0.003,
      }));

      const orbCount = Math.floor(area / 180000) + 5;
      orbs = Array.from({ length: orbCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 300 + 150,
        hue: [250, 265, 280, 220, 240][Math.floor(Math.random() * 5)],
        saturation: Math.random() * 30 + 50,
        speed: Math.random() * 0.2 + 0.05,
        phase: Math.random() * Math.PI * 2,
        driftX: Math.random() * 0.4 + 0.1,
        driftY: Math.random() * 0.3 + 0.1,
      }));

      particles = Array.from({ length: 30 }, () => createParticle());
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.1,
      size: Math.random() * 2 + 0.5,
      life: 0,
      maxLife: Math.random() * 400 + 200,
      hue: Math.random() > 0.5 ? 270 : 220,
    });

    const draw = () => {
      time += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.9
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.3)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating orbs with breathing effect
      orbs.forEach((orb) => {
        const ox = orb.x + Math.sin(time * orb.speed + orb.phase) * 80;
        const oy = orb.y + Math.cos(time * orb.driftY + orb.phase) * 50;
        const breathe = 1 + Math.sin(time * 0.3 + orb.phase) * 0.15;
        const r = orb.radius * breathe;

        const gradient = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        const alpha = 0.04 + Math.sin(time * 0.4 + orb.phase) * 0.02;

        gradient.addColorStop(0, `hsla(${orb.hue}, ${orb.saturation}%, 55%, ${alpha * 1.5})`);
        gradient.addColorStop(0.4, `hsla(${orb.hue}, ${orb.saturation - 10}%, 40%, ${alpha})`);
        gradient.addColorStop(0.7, `hsla(${orb.hue}, ${orb.saturation - 20}%, 30%, ${alpha * 0.3})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Stars with soft glow
      stars.forEach((star) => {
        star.pulse += star.pulseSpeed;
        const opacity = star.opacity * (0.4 + 0.6 * Math.sin(star.pulse));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 170, 240, ${opacity})`;
        ctx.fill();

        if (star.size > 0.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(170, 150, 240, ${opacity * 0.08})`;
          ctx.fill();
        }
      });

      // Floating particles
      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += (Math.random() - 0.5) * 0.02;

        if (p.life > p.maxLife) {
          particles[i] = createParticle();
          return;
        }

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1
          ? lifeRatio * 10 * 0.3
          : lifeRatio > 0.8
            ? (1 - lifeRatio) * 5 * 0.3
            : 0.3;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 65%, ${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default Starfield;
