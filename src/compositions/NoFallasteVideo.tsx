import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";
import {loadDefaultFonts} from "../presets/fonts";

loadDefaultFonts();

// ─── timing (frames @ 30fps) ───────────────────────────────────────────────
const HOOK_START = 0;
const VAL_START = 240;   // 8s
const GIRO_START = 750;  // 25s
const SOL_START = 1500;  // 50s
const CTA_START = 2250;  // 75s
const FINAL_START = 2460; // 82s
const TOTAL = 2700;      // 90s

// ─── design tokens ──────────────────────────────────────────────────────────
const BG_DARK = "#0a0a12";
const ACCENT = "#4F46E5";
const ACCENT_LIGHT = "#818CF8";
const WHITE = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.55)";

// ─── helpers ────────────────────────────────────────────────────────────────
function useEntrance(delay = 0, duration = 18) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({fps, frame: frame - delay, config: {damping: 18, stiffness: 140}, durationInFrames: duration});
  const opacity = interpolate(p, [0, 1], [0, 1]);
  const y = interpolate(p, [0, 1], [28, 0]);
  return {opacity, y};
}

// ─── Section label chip ─────────────────────────────────────────────────────
const SectionLabel: React.FC<{label: string; color?: string}> = ({label, color = ACCENT}) => {
  const {opacity, y} = useEntrance(0, 14);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        display: "inline-block",
        background: `${color}22`,
        border: `1.5px solid ${color}66`,
        borderRadius: 100,
        padding: "6px 20px",
        fontSize: 22,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        color: color,
        letterSpacing: 2,
        textTransform: "uppercase" as const,
        marginBottom: 28,
      }}
    >
      {label}
    </div>
  );
};

// ─── Single animated line of text ───────────────────────────────────────────
const Line: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  weight?: number;
  color?: string;
  align?: "left" | "center" | "right";
  italic?: boolean;
}> = ({text, delay = 0, fontSize = 52, weight = 700, color = WHITE, align = "center", italic = false}) => {
  const {opacity, y} = useEntrance(delay, 16);
  return (
    <p
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        fontFamily: "'Inter', sans-serif",
        fontSize,
        fontWeight: weight,
        color,
        lineHeight: 1.35,
        margin: "6px 0",
        textAlign: align,
        fontStyle: italic ? "italic" : "normal",
        padding: 0,
      }}
    >
      {text}
    </p>
  );
};

// ─── Animated divider ───────────────────────────────────────────────────────
const Divider: React.FC<{delay?: number}> = ({delay = 0}) => {
  const frame = useCurrentFrame();
  const width = interpolate(frame - delay, [0, 20], [0, 100], {extrapolateRight: "clamp"});
  return (
    <div style={{width: "100%", marginBottom: 28, marginTop: 12}}>
      <div style={{height: 2, width: `${width}%`, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT}00)`, borderRadius: 2}} />
    </div>
  );
};

// ─── Background with subtle noise & gradient ────────────────────────────────
const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, TOTAL], [0, 20]);
  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `radial-gradient(ellipse 90% 60% at 50% ${30 - shift * 0.3}%, #1e1b4b 0%, ${BG_DARK} 70%)`,
        }}
      />
      {/* subtle grid lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Progress bar ───────────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, TOTAL], [0, 100]);
  return (
    <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.08)"}}>
      <div style={{height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_LIGHT})`, borderRadius: 2}} />
    </div>
  );
};

// ─── HOOK section ───────────────────────────────────────────────────────────
const HookSection: React.FC = () => (
  <AbsoluteFill style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px"}}>
    <SectionLabel label="Hook" />
    <Divider />
    <Line text="¿Cuántas veces has intentado" fontSize={54} delay={4} />
    <Line text="aprender inglés..." fontSize={54} delay={10} />
    <Line text="y has terminado abandonándolo?" fontSize={50} delay={16} color={ACCENT_LIGHT} />
    <div style={{height: 36}} />
    <Line text="Una app por dos semanas." fontSize={42} weight={400} delay={30} color={MUTED} />
    <Line text="Un curso de YouTube." fontSize={42} weight={400} delay={38} color={MUTED} />
    <Line text="Unas clases que empezaron bien..." fontSize={42} weight={400} delay={46} color={MUTED} />
    <Line text="Y después nada." fontSize={42} weight={600} delay={56} color={WHITE} />
    <div style={{height: 32}} />
    <Line text="Si te pasó eso, este video es para ti." fontSize={44} weight={700} delay={70} color={ACCENT_LIGHT} italic />
  </AbsoluteFill>
);

// ─── VALIDACIÓN section ─────────────────────────────────────────────────────
const ValidacionSection: React.FC = () => (
  <AbsoluteFill style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px"}}>
    <SectionLabel label="La verdad" color="#10B981" />
    <Divider delay={4} />
    <Line text="No significa que seas malo" fontSize={50} delay={6} />
    <Line text="para los idiomas." fontSize={50} delay={12} />
    <div style={{height: 20}} />
    <Line text="No significa que tengas mala memoria." fontSize={44} weight={400} delay={22} color={MUTED} />
    <Line text="Ni que ya seas mayor para aprender." fontSize={44} weight={400} delay={30} color={MUTED} />
    <div style={{height: 24}} />
    <Line text="La mayoría llega a nosotros" fontSize={46} weight={600} delay={42} />
    <Line text="con exactamente la misma historia." fontSize={46} weight={600} delay={50} />
    <div style={{height: 24}} />
    <Line text="Empiezan motivadas." fontSize={40} weight={400} delay={62} color={MUTED} />
    <Line text="Estudian unos días." fontSize={40} weight={400} delay={68} color={MUTED} />
    <Line text="Y poco a poco lo dejan." fontSize={40} weight={700} delay={76} color="#10B981" />
  </AbsoluteFill>
);

// ─── GIRO section ───────────────────────────────────────────────────────────
const GiroSection: React.FC = () => (
  <AbsoluteFill style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px"}}>
    <SectionLabel label="El problema real" color="#F59E0B" />
    <Divider delay={4} />
    <Line text="Después de años enseñando inglés," fontSize={46} delay={6} />
    <Line text="descubrimos algo interesante." fontSize={46} delay={14} color={ACCENT_LIGHT} />
    <div style={{height: 28}} />
    <Line text="La gente no abandona porque" fontSize={44} weight={400} delay={26} color={MUTED} />
    <Line text="el inglés sea difícil." fontSize={44} weight={400} delay={32} color={MUTED} />
    <div style={{height: 8}} />
    <Line text="Abandona porque el método" fontSize={50} weight={800} delay={44} color={WHITE} />
    <Line text="está diseñado al revés." fontSize={50} weight={800} delay={52} color="#F59E0B" />
    <div style={{height: 28}} />
    <Line text="Primero reglas. Más reglas." fontSize={40} weight={400} delay={66} color={MUTED} />
    <Line text="Excepciones de las reglas." fontSize={40} weight={400} delay={74} color={MUTED} />
    <div style={{height: 16}} />
    <Line text="Como aprender a nadar" fontSize={44} weight={600} delay={88} italic />
    <Line text="leyendo un libro." fontSize={44} weight={600} delay={96} italic color={ACCENT_LIGHT} />
  </AbsoluteFill>
);

// ─── SOLUCIÓN section ───────────────────────────────────────────────────────
const SolucionSection: React.FC = () => (
  <AbsoluteFill style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px"}}>
    <SectionLabel label="La solución" color="#6366F1" />
    <Divider delay={4} />
    <Line text="Nuestras clases funcionan diferente." fontSize={50} weight={800} delay={6} />
    <div style={{height: 32}} />
    {[
      {icon: "🎯", text: "Practicas situaciones reales desde el inicio.", d: 18},
      {icon: "👨‍🏫", text: "Hablas con profesores en vivo.", d: 30},
      {icon: "⚡", text: "Correcciones en tiempo real.", d: 42},
      {icon: "🗺️", text: "Una ruta clara cada semana.", d: 54},
    ].map(({icon, text, d}) => (
      <BulletLine key={text} icon={icon} text={text} delay={d} />
    ))}
    <div style={{height: 28}} />
    <Line text="Sin adivinar. Sin perder tiempo." fontSize={42} weight={700} delay={66} color={MUTED} />
    <Line text="Sin empezar desde cero cada mes." fontSize={42} weight={700} delay={74} color={MUTED} />
  </AbsoluteFill>
);

const BulletLine: React.FC<{icon: string; text: string; delay: number}> = ({icon, text, delay}) => {
  const {opacity, y} = useEntrance(delay, 16);
  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        width: "100%",
        marginBottom: 14,
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: "16px 24px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <span style={{fontSize: 34}}>{icon}</span>
      <span style={{fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 600, color: WHITE, lineHeight: 1.3}}>
        {text}
      </span>
    </div>
  );
};

// ─── CTA section ────────────────────────────────────────────────────────────
const CtaSection: React.FC = () => (
  <AbsoluteFill style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 80px"}}>
    <SectionLabel label="Reflexión final" color={ACCENT_LIGHT} />
    <Divider delay={4} />
    <Line text="Si ya intentaste aprender inglés" fontSize={48} delay={6} />
    <Line text="y sentiste que no funcionó..." fontSize={48} delay={14} />
    <div style={{height: 20}} />
    <Line text="No te rindas todavía." fontSize={58} weight={800} delay={28} color={WHITE} />
    <div style={{height: 28}} />
    <Line text="Quizás el problema nunca fuiste tú." fontSize={46} weight={600} delay={42} color={MUTED} italic />
    <div style={{height: 16}} />
    <Line text="Quizás solo necesitabas un método" fontSize={46} weight={700} delay={56} />
    <Line text="diseñado para que realmente hables." fontSize={46} weight={700} delay={64} color={ACCENT_LIGHT} />
    <div style={{height: 36}} />
    <Line text="Envíanos un mensaje →" fontSize={50} weight={800} delay={78} color={ACCENT_LIGHT} />
  </AbsoluteFill>
);

// ─── FINAL CARD ─────────────────────────────────────────────────────────────
const FinalCard: React.FC = () => {
  const frame = useCurrentFrame();
  const bgOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp"});
  const scale = interpolate(
    spring({fps: 30, frame, config: {damping: 14, stiffness: 100}}),
    [0, 1],
    [0.88, 1]
  );
  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        opacity: bgOpacity,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          background: "linear-gradient(135deg, #1e1b4b 0%, #0a0a12 100%)",
          border: `2px solid ${ACCENT}55`,
          borderRadius: 32,
          padding: "60px 56px",
          width: "100%",
          textAlign: "center",
          boxShadow: `0 0 80px ${ACCENT}22`,
        }}
      >
        <div style={{fontSize: 52, marginBottom: 28}}>🌟</div>
        {[
          {text: "Habla inglés con confianza.", size: 52, weight: 800, color: WHITE},
          {text: "Clases virtuales en vivo.", size: 44, weight: 500, color: MUTED},
          {text: "Profesores reales.", size: 44, weight: 500, color: MUTED},
          {text: "Escríbenos hoy.", size: 50, weight: 800, color: ACCENT_LIGHT},
        ].map(({text, size, weight, color}, i) => (
          <FinalLine key={text} text={text} fontSize={size} weight={weight} color={color} delay={i * 14} />
        ))}
        <div style={{marginTop: 36, height: 2, background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`}} />
      </div>
    </AbsoluteFill>
  );
};

const FinalLine: React.FC<{text: string; fontSize: number; weight: number; color: string; delay: number}> = ({
  text, fontSize, weight, color, delay,
}) => {
  const {opacity, y} = useEntrance(delay, 18);
  return (
    <p style={{opacity, transform: `translateY(${y}px)`, fontFamily: "'Inter', sans-serif", fontSize, fontWeight: weight, color, margin: "10px 0", lineHeight: 1.3}}>
      {text}
    </p>
  );
};

// ─── ROOT COMPOSITION ───────────────────────────────────────────────────────
export const NoFallasteVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: BG_DARK}}>
      <Background />
      <ProgressBar />

      <Sequence from={HOOK_START} durationInFrames={VAL_START - HOOK_START}>
        <HookSection />
      </Sequence>

      <Sequence from={VAL_START} durationInFrames={GIRO_START - VAL_START}>
        <ValidacionSection />
      </Sequence>

      <Sequence from={GIRO_START} durationInFrames={SOL_START - GIRO_START}>
        <GiroSection />
      </Sequence>

      <Sequence from={SOL_START} durationInFrames={CTA_START - SOL_START}>
        <SolucionSection />
      </Sequence>

      <Sequence from={CTA_START} durationInFrames={FINAL_START - CTA_START}>
        <CtaSection />
      </Sequence>

      <Sequence from={FINAL_START} durationInFrames={TOTAL - FINAL_START}>
        <FinalCard />
      </Sequence>
    </AbsoluteFill>
  );
};
