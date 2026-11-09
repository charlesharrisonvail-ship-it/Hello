import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

export const LISTING_FLIGHT_FRAMES = 600;

const C = {
  ink: "#04070d",
  panel: "#0d1524",
  blue: "#38bdf8",
  rasp: "#d63a73",
  white: "#ffffff",
  text: "#dbe2ec",
  slate: "#8496b2",
};

const fontFaces = `
@font-face { font-family: Archivo; src: url(${staticFile("fonts/Archivo.ttf")}) format("truetype"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: Manrope; src: url(${staticFile("fonts/Manrope.ttf")}) format("truetype"); font-weight: 200 800; }
@font-face { font-family: Plex; src: url(${staticFile("fonts/IBMPlexMono.ttf")}) format("truetype"); }
`;

const head: React.CSSProperties = { fontFamily: "Archivo", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.95 };
const mono: React.CSSProperties = { fontFamily: "Plex", letterSpacing: "0.22em", textTransform: "uppercase" };

const useIn = (delay: number, damping = 14) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping, mass: 0.7 } });
};

const Rise: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const p = useIn(delay);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 70}px)`, ...style }}>{children}</div>
  );
};

const Background: React.FC = () => {
  const f = useCurrentFrame();
  const drift = (f * 0.6) % 120;
  const glowX = 50 + Math.sin(f / 50) * 18;
  const glowY = 40 + Math.cos(f / 70) * 12;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(56,189,248,0.22), transparent 45%), radial-gradient(circle at ${100 - glowX}% ${100 - glowY}%, rgba(214,58,115,0.16), transparent 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(132,150,178,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(132,150,178,0.07) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${drift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Center: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: top === undefined ? "center" : "flex-start",
      paddingTop: top,
      textAlign: "center",
      padding: top === undefined ? "0 70px" : `${top}px 70px 0`,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const slam = useIn(10, 9);
  const strike = interpolate(f, [42, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const shake = f > 10 && f < 22 ? Math.sin(f * 2.5) * (22 - f) * 1.2 : 0;
  return (
    <Center>
      <Rise delay={0}>
        <div style={{ ...mono, color: C.slate, fontSize: 30, marginBottom: 30 }}>Licensed drone operator · per shoot</div>
      </Rise>
      <Rise delay={2}>
        <div style={{ ...head, color: C.white, fontSize: 112 }}>Your listing<br />video cost</div>
      </Rise>
      <div style={{ position: "relative", marginTop: 26, transform: `scale(${0.6 + slam * 0.4}) translateX(${shake}px)`, opacity: slam }}>
        <div style={{ ...head, color: C.rasp, fontSize: 168, whiteSpace: "nowrap" }}>$250–$550</div>
        <div
          style={{
            position: "absolute",
            left: -10,
            top: "52%",
            height: 18,
            width: `${strike * 104}%`,
            background: C.white,
            borderRadius: 9,
            transform: "rotate(-4deg)",
            boxShadow: "0 0 30px rgba(255,255,255,0.5)",
          }}
        />
      </div>
    </Center>
  );
};

const FewDollars: React.FC = () => {
  const pop = useIn(8, 10);
  return (
    <Center>
      <Rise>
        <div style={{ ...head, color: C.white, fontSize: 120 }}>This one cost</div>
      </Rise>
      <div style={{ ...head, color: C.blue, fontSize: 168, marginTop: 24, transform: `scale(${0.5 + pop * 0.5})`, opacity: pop, textShadow: "0 0 60px rgba(56,189,248,0.45)" }}>
        a few dollars.
      </div>
    </Center>
  );
};

const PhotoFrame: React.FC<{ src: string; scale: number; x: number; opacity: number; label: string; color: string }> = ({ src, scale, x, opacity, label, color }) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 34 }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale}) translateX(${x}px)` }} />
    </div>
    <div style={{ position: "absolute", left: 28, top: 26, ...mono, fontSize: 26, color: C.white, background: "rgba(4,7,13,0.72)", border: `2px solid ${color}`, padding: "10px 20px", borderRadius: 40 }}>
      {label}
    </div>
  </div>
);

const Flight: React.FC = () => {
  const f = useCurrentFrame();
  const cross = interpolate(f, [75, 105], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const beforeScale = interpolate(f, [0, 105], [1.05, 1.25], { extrapolateRight: "clamp" });
  const afterScale = interpolate(f, [75, 210], [1.5, 1.08], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const afterX = interpolate(f, [75, 210], [-60, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const enter = useIn(0, 16);
  const line2 = useIn(95);
  return (
    <AbsoluteFill>
      <Center top={300}>
        <Rise>
          <div style={{ ...head, color: C.white, fontSize: 112 }}>One photo in.</div>
        </Rise>
        <div style={{ ...head, color: C.blue, fontSize: 104, marginTop: 14, opacity: line2, transform: `translateY(${(1 - line2) * 50}px)` }}>
          A drone-style flight out.
        </div>
      </Center>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: 700,
          height: 640,
          transform: `translateY(${(1 - enter) * 200}px) rotate(${(1 - enter) * -3}deg)`,
          opacity: enter,
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(56,189,248,0.25)",
          borderRadius: 34,
        }}
      >
        <PhotoFrame src="before.jpg" scale={beforeScale} x={0} opacity={1 - cross} label="The photo" color={C.slate} />
        <PhotoFrame src="after.jpg" scale={afterScale} x={afterX} opacity={cross} label="The flight" color={C.blue} />
      </div>
      <Center top={1400}>
        <div style={{ ...mono, fontSize: 26, color: C.slate, opacity: enter }}>Demonstration · Made with AI</div>
      </Center>
    </AbsoluteFill>
  );
};

const NoList: React.FC = () => {
  const items = [
    { t: "No pilot.", c: C.white },
    { t: "No weather window.", c: C.white },
    { t: "About 90 seconds", c: C.blue },
    { t: "of work.", c: C.blue },
  ];
  return (
    <Center>
      {items.map((it, i) => (
        <Rise key={it.t} delay={i * 9}>
          <div style={{ ...head, color: it.c, fontSize: 120, marginBottom: 22 }}>{it.t}</div>
        </Rise>
      ))}
    </Center>
  );
};

const Chip: React.FC<{ delay: number; from: number; label: string; price: string; color: string }> = ({ delay, from, label, price, color }) => {
  const p = useIn(delay, 13);
  return (
    <div
      style={{
        transform: `translateX(${(1 - p) * from}px)`,
        opacity: p,
        border: `3px solid ${color}`,
        background: "rgba(13,21,36,0.85)",
        borderRadius: 36,
        padding: "40px 54px",
        width: 880,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 34,
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div style={{ ...mono, fontSize: 26, color: C.slate }}>{label.split("|")[0]}</div>
        <div style={{ ...head, fontSize: 68, color: C.white, marginTop: 10 }}>{label.split("|")[1]}</div>
      </div>
      <div style={{ ...head, fontSize: 120, color }}>{price}</div>
    </div>
  );
};

const Courses: React.FC = () => (
  <Center>
    <Rise>
      <div style={{ ...head, color: C.white, fontSize: 110, marginBottom: 60 }}>Two courses.</div>
    </Rise>
    <Chip delay={8} from={-900} label="Part One|Listing media" price="$67" color={C.blue} />
    <Chip delay={16} from={900} label="Part Two|Lead to Keys" price="$97" color={C.rasp} />
  </Center>
);

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const logo = useIn(0, 12);
  const pill = useIn(10, 11);
  const pulse = 1 + Math.sin(Math.max(0, f - 25) / 6) * 0.025;
  return (
    <Center>
      <Img src={staticFile("logo.png")} style={{ width: 420, opacity: logo, transform: `scale(${0.7 + logo * 0.3})` }} />
      <Rise delay={6}>
        <div style={{ ...head, color: C.white, fontSize: 84, marginTop: 50 }}>Make it yourself.</div>
      </Rise>
      <div
        style={{
          marginTop: 70,
          background: C.blue,
          color: C.ink,
          fontFamily: "Manrope",
          fontWeight: 800,
          fontSize: 62,
          padding: "30px 64px",
          borderRadius: 80,
          opacity: pill,
          transform: `scale(${(0.6 + pill * 0.4) * pulse})`,
          boxShadow: "0 0 80px rgba(56,189,248,0.5)",
        }}
      >
        learn.aireestate.com
      </div>
      <Rise delay={18}>
        <div style={{ fontFamily: "Manrope", fontWeight: 500, color: C.slate, fontSize: 34, marginTop: 56 }}>
          Made for agents, by agents.
        </div>
      </Rise>
      <Rise delay={22}>
        <div style={{ ...mono, color: C.slate, fontSize: 24, marginTop: 30 }}>Made with AI</div>
      </Rise>
    </Center>
  );
};

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const ListingFlight: React.FC = () => {
  const scenes: [number, number, React.FC][] = [
    [0, 75, Hook],
    [75, 60, FewDollars],
    [135, 225, Flight],
    [360, 90, NoList],
    [450, 75, Courses],
    [525, 75, EndCard],
  ];
  return (
    <AbsoluteFill>
      <style>{fontFaces}</style>
      <Background />
      {scenes.map(([from, dur, Scene], i) => (
        <Sequence key={i} from={from} durationInFrames={dur}>
          {i < scenes.length - 1 ? (
            <Fade dur={dur}>
              <Scene />
            </Fade>
          ) : (
            <Scene />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
