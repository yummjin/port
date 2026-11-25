import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { cn } from "@/lib/cn";
import {
  PLAYER_NAMES,
  PLAYERS,
  rankLabel,
  SUIT_SYMBOL,
  sortHand,
  suitOf,
  type CardId,
  type GameState,
} from "@/lib/mighty";

const ME = 0;

const CARD_W = 0.8;
const CARD_H = 1.16;
const CARD_D = 0.012;
const TABLE_W = 9;
const TABLE_D = 6.4;
const SEAT_RX = 3.6;
const SEAT_RZ = 2.45;
/** How long a finished trick stays in the middle before flying to the winner. */
const COLLECT_DELAY = 450;
const HAND_TILT = -0.95;
const FACE_UP = -Math.PI / 2;
const FACE_DOWN = Math.PI / 2;

type Vec3 = [number, number, number];
type Pose = { pos: Vec3; rot: Vec3; scale?: number };

export type Table3DProps = {
  game: GameState;
  /** Cards in my hand that respond to clicks. */
  clickable: CardId[];
  /** Cards drawn dimmed (not playable right now). */
  dimmed: CardId[];
  /** Cards lifted out of the hand (pending joker choice, exchange discards). */
  raised: CardId[];
  onCardClick: (card: CardId) => void;
};

export default function Table3D(props: Table3DProps) {
  const [labels, setLabels] = useState<{ x: number; y: number }[]>([]);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 8.2, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setCursor(false)}
      >
        <CameraRig onProject={setLabels} />
        <Scene {...props} />
      </Canvas>

      {labels.map(({ x, y }, p) =>
        p === ME ? null : (
          <div
            key={p}
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: x, top: y }}
          >
            <SeatLabel game={props.game} player={p} />
          </div>
        ),
      )}
    </div>
  );
}

// ---------- layout ----------

function seatAngle(p: number) {
  return Math.PI / 2 + (p * 2 * Math.PI) / PLAYERS;
}

/** Point on the seat ellipse; factor 1 is the seat itself, 0 the table center. */
function seatPoint(p: number, factor: number, y = 0): Vec3 {
  const a = seatAngle(p);
  return [Math.cos(a) * SEAT_RX * factor, y, Math.sin(a) * SEAT_RZ * factor];
}

/** Yaw that turns a flat card's bottom edge toward player p. */
function seatYaw(p: number) {
  return -seatAngle(p) + Math.PI / 2;
}

/**
 * My hand, fanned in front of the camera. `zoom` grows the fan on narrow
 * stages (where the camera pulls back) so cards stay large enough to tap.
 */
function handPose(
  index: number,
  count: number,
  lift: number,
  zoom: number,
): Pose {
  const s = Math.min(Math.max(zoom, 1), 1.3);
  const spread = Math.min(0.56, 6.2 / Math.max(count, 1)) * s;
  const x = (index - (count - 1) / 2) * spread;
  // Push each later card slightly toward the camera so overlaps never z-fight.
  const nudge = index * 0.01 * s;
  // Arc and lift move along the card's own up axis (in its tilted plane), so
  // they never change depth order between neighbors.
  const up = (lift - (x * x * 0.03) / s) * s;
  return {
    pos: [
      x,
      0.85 * s + nudge * 0.81 + up * 0.58,
      3.05 + (s - 1) * 0.6 + nudge * 0.58 - up * 0.81,
    ],
    rot: [HAND_TILT, 0, (-x * 0.05) / s],
    scale: s,
  };
}

/**
 * Played cards stand upright toward me (not toward the player who played
 * them) and lean back toward the camera so every rank is readable.
 */
function trickPose(p: number, order: number, card: CardId): Pose {
  const [x, , z] = seatPoint(p, 0.42);
  const jitter = ((card.charCodeAt(1) || 0) % 5) * 0.03 - 0.06;
  return {
    pos: [x * 1.05, 0.36 + order * 0.01, z * 0.85],
    rot: [FACE_UP + 0.5, jitter, 0],
    scale: 1.25,
  };
}

function aiHandPose(p: number, index: number, count: number): Pose {
  const a = seatAngle(p);
  const [cx, , cz] = seatPoint(p, 0.74);
  const t = (index - (count - 1) / 2) * 0.15;
  // Spread along the tangent of the ellipse so the fan faces the center.
  return {
    pos: [cx - Math.sin(a) * t, 0.01 + index * 0.003, cz + Math.cos(a) * t],
    rot: [FACE_DOWN, seatYaw(p), 0],
  };
}

// ---------- scene ----------

function Scene({ game, clickable, dimmed, raised, onCardClick }: Table3DProps) {
  const colors = useThemeColors();
  const zoom = useZoom();
  const collecting = useCollecting(game);
  const [hovered, setHovered] = useState<CardId | null>(null);
  const hand = useMemo(
    () => sortHand(game.hands[ME], game.trump),
    [game.hands, game.trump],
  );

  const deck: Pose = { pos: [0, 0.03, 0], rot: [FACE_DOWN, 0, 0] };

  const cards: {
    card: CardId;
    pose: Pose;
    spawn: Pose;
    interactive: boolean;
    dim: boolean;
  }[] = [];

  hand.forEach((card, i) => {
    const interactive = clickable.includes(card);
    cards.push({
      card,
      pose: handPose(
        i,
        hand.length,
        raised.includes(card) || (interactive && hovered === card)
          ? 0.3
          : interactive && dimmed.length > 0
            ? 0.1
            : 0,
        zoom,
      ),
      spawn: deck,
      interactive,
      dim: dimmed.includes(card),
    });
  });

  game.trick.forEach(({ player, card }, order) => {
    const winner = game.trickWinner;
    const pose =
      collecting && winner !== null
        ? {
            pos: seatPoint(winner, 0.95, 0.02 + order * 0.004),
            rot: [FACE_UP, seatYaw(winner), 0] as Vec3,
          }
        : trickPose(player, order, card);
    const handCount = game.hands[player].length + 1;
    cards.push({
      card,
      pose,
      spawn: aiHandPose(player, handCount - 1, handCount),
      interactive: false,
      dim: false,
    });
  });

  return (
    <>
      <TableSurface fill={colors.border} edge={colors.muted} />

      {cards.map(({ card, pose, spawn, interactive, dim }) => (
        <Card3D
          key={card}
          card={card}
          pose={pose}
          spawn={spawn}
          dim={dim}
          interactive={interactive}
          onHover={(on) => setHovered(on ? card : null)}
          onClick={() => onCardClick(card)}
        />
      ))}

      {Array.from({ length: PLAYERS }, (_, p) => p)
        .filter((p) => p !== ME)
        .map((p) => (
          <group key={p}>
            {game.hands[p].map((_, i) => (
              <CardBack key={i} pose={aiHandPose(p, i, game.hands[p].length)} />
            ))}
          </group>
        ))}
    </>
  );
}

function TableSurface({ fill, edge }: { fill: string; edge: string }) {
  const outline = useMemo(() => {
    const w = TABLE_W / 2;
    const d = TABLE_D / 2;
    return new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-w, 0.001, -d),
      new THREE.Vector3(w, 0.001, -d),
      new THREE.Vector3(w, 0.001, d),
      new THREE.Vector3(-w, 0.001, d),
    ]);
  }, []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[TABLE_W, TABLE_D]} />
        <meshBasicMaterial color={fill} />
      </mesh>
      <lineLoop geometry={outline}>
        <lineBasicMaterial color={edge} />
      </lineLoop>
    </group>
  );
}

function SeatLabel({ game, player }: { game: GameState; player: number }) {
  const active =
    game.turn === player &&
    game.phase !== "result" &&
    game.phase !== "trickEnd";
  const won = game.phase === "trickEnd" && game.trickWinner === player;
  const revealAll = game.phase === "result";
  const role =
    game.declarer === player
      ? "주공"
      : game.friend === player && (game.friendRevealed || revealAll)
        ? "프렌드"
        : null;

  return (
    <div
      className={cn(
        "bg-surface text-caption flex flex-col items-center border px-2 py-1 whitespace-nowrap transition-colors duration-200",
        active || won ? "border-foreground" : "border-border",
      )}
    >
      <span className="text-foreground font-medium">
        {PLAYER_NAMES[player]}
        {role && <span className="text-muted font-normal"> · {role}</span>}
      </span>
    </div>
  );
}

// ---------- cards ----------

function Card3D({
  card,
  pose,
  spawn,
  dim,
  interactive,
  onHover,
  onClick,
}: {
  card: CardId;
  pose: Pose;
  spawn: Pose;
  dim: boolean;
  interactive: boolean;
  onHover: (on: boolean) => void;
  onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();
  const materials = useMemo(() => {
    const edge = new THREE.MeshBasicMaterial({ color: "#d2d2d7" });
    return [
      edge,
      edge,
      edge,
      edge,
      new THREE.MeshBasicMaterial({ map: faceTexture(card) }),
      new THREE.MeshBasicMaterial({ map: backTexture() }),
    ];
  }, [card]);

  useEffect(
    () => () => materials.forEach((material) => material.dispose()),
    [materials],
  );

  useEffect(() => {
    (materials[4] as THREE.MeshBasicMaterial).color.set(
      dim ? "#9a9aa0" : "#ffffff",
    );
  }, [dim, materials]);

  useLayoutEffect(() => {
    const mesh = ref.current!;
    mesh.rotation.order = "YXZ";
    mesh.position.set(...spawn.pos);
    mesh.rotation.set(...spawn.rot);
    // Spawn pose applies only to the first frame this card exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    const mesh = ref.current;
    if (!mesh) return;
    const lambda = reduced ? Infinity : 9;
    const dt = Math.min(delta, 0.05);
    const { damp } = THREE.MathUtils;
    mesh.position.set(
      damp(mesh.position.x, pose.pos[0], lambda, dt),
      damp(mesh.position.y, pose.pos[1], lambda, dt),
      damp(mesh.position.z, pose.pos[2], lambda, dt),
    );
    mesh.rotation.set(
      damp(mesh.rotation.x, pose.rot[0], lambda, dt),
      damp(mesh.rotation.y, pose.rot[1], lambda, dt),
      damp(mesh.rotation.z, pose.rot[2], lambda, dt),
    );
    mesh.scale.setScalar(damp(mesh.scale.x, pose.scale ?? 1, lambda, dt));
  });

  return (
    <mesh
      ref={ref}
      material={materials}
      onPointerOver={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        onHover(true);
        setCursor(true);
      }}
      onPointerOut={() => {
        if (!interactive) return;
        onHover(false);
        setCursor(false);
      }}
      onClick={(e) => {
        if (!interactive) return;
        e.stopPropagation();
        onClick();
      }}
    >
      <boxGeometry args={[CARD_W, CARD_H, CARD_D]} />
    </mesh>
  );
}

function CardBack({ pose }: { pose: Pose }) {
  const materials = useMemo(() => {
    const edge = new THREE.MeshBasicMaterial({ color: "#d2d2d7" });
    const back = new THREE.MeshBasicMaterial({ map: backTexture() });
    return [edge, edge, edge, edge, back, back];
  }, []);

  useEffect(
    () => () => materials.forEach((material) => material.dispose()),
    [materials],
  );

  return (
    <mesh
      position={pose.pos}
      rotation={new THREE.Euler(...pose.rot, "YXZ")}
      material={materials}
    >
      <boxGeometry args={[CARD_W * 0.8, CARD_H * 0.8, CARD_D]} />
    </mesh>
  );
}

// ---------- textures (drawn once per card, shared across renders) ----------

const TEX_W = 256;
const TEX_H = 372;
const FONT = 'Helvetica, "Helvetica Neue", Arial, sans-serif';
const textureCache = new Map<string, THREE.CanvasTexture>();

function makeTexture(
  key: string,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  const cached = textureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement("canvas");
  // Draw at 2x so corner indices stay crisp when the card is close to the camera.
  canvas.width = TEX_W * 2;
  canvas.height = TEX_H * 2;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(2, 2);
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  textureCache.set(key, texture);
  return texture;
}

/** Classic pip layouts as [column, row] in a 3×(0..1) grid; rows > 0.5 flip. */
const PIPS: Record<string, [number, number][]> = {
  "2": [
    [1, 0],
    [1, 1],
  ],
  "3": [
    [1, 0],
    [1, 0.5],
    [1, 1],
  ],
  "4": [
    [0, 0],
    [2, 0],
    [0, 1],
    [2, 1],
  ],
  "5": [
    [0, 0],
    [2, 0],
    [1, 0.5],
    [0, 1],
    [2, 1],
  ],
  "6": [
    [0, 0],
    [2, 0],
    [0, 0.5],
    [2, 0.5],
    [0, 1],
    [2, 1],
  ],
  "7": [
    [0, 0],
    [2, 0],
    [1, 0.25],
    [0, 0.5],
    [2, 0.5],
    [0, 1],
    [2, 1],
  ],
  "8": [
    [0, 0],
    [2, 0],
    [1, 0.25],
    [0, 0.5],
    [2, 0.5],
    [1, 0.75],
    [0, 1],
    [2, 1],
  ],
  "9": [
    [0, 0],
    [2, 0],
    [0, 1 / 3],
    [2, 1 / 3],
    [1, 0.5],
    [0, 2 / 3],
    [2, 2 / 3],
    [0, 1],
    [2, 1],
  ],
  "10": [
    [0, 0],
    [2, 0],
    [1, 1 / 6],
    [0, 1 / 3],
    [2, 1 / 3],
    [0, 2 / 3],
    [2, 2 / 3],
    [1, 5 / 6],
    [0, 1],
    [2, 1],
  ],
};

const RED = "#d70015";
const BLACK = "#1d1d1f";
const SERIF = 'Georgia, "Times New Roman", serif';

function faceTexture(card: CardId) {
  return makeTexture(`face-${card}`, (ctx) => {
    const suit = suitOf(card);
    const ink = suit === "D" || suit === "H" ? RED : BLACK;
    const symbol = suit ? SUIT_SYMBOL[suit] : "★";
    const rank = suit ? rankLabel(card) : "JOKER";

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    ctx.strokeStyle = BLACK;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, TEX_W - 4, TEX_H - 4);

    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Corner index (rank over small suit), mirrored at the bottom right.
    const corner = () => {
      if (suit) {
        ctx.font = `bold ${rank === "10" ? 34 : 40}px ${SERIF}`;
        ctx.fillText(rank, 26, 32);
        ctx.font = `28px ${FONT}`;
        ctx.fillText(symbol, 26, 66);
      } else {
        ctx.font = `bold 24px ${SERIF}`;
        [..."JOKER"].forEach((ch, i) => ctx.fillText(ch, 24, 30 + i * 26));
      }
    };
    corner();
    withFlip(ctx, corner);

    if (!suit) {
      drawCourt(ctx, BLACK, "★", "");
      return;
    }
    if (rank === "J" || rank === "Q" || rank === "K") {
      drawCourt(ctx, ink, symbol, rank);
      return;
    }
    if (rank === "A") {
      ctx.font = `${suit === "S" ? 150 : 72}px ${FONT}`;
      ctx.fillText(symbol, TEX_W / 2, TEX_H / 2 + 4);
      return;
    }

    // Pip area between the corner indices.
    const cols = [84, 128, 172];
    const top = 64;
    const bottom = TEX_H - 64;
    ctx.font = `52px ${FONT}`;
    for (const [c, r] of PIPS[rank] ?? []) {
      const x = cols[c];
      const y = top + (bottom - top) * r;
      if (r > 0.5) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.PI);
        ctx.fillText(symbol, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(symbol, x, y);
      }
    }
  });
}

/** Run `draw` again rotated 180° around the card center. */
function withFlip(ctx: CanvasRenderingContext2D, draw: () => void) {
  ctx.save();
  ctx.translate(TEX_W, TEX_H);
  ctx.rotate(Math.PI);
  draw();
  ctx.restore();
}

const GOLD = "#f2c230";
const CRIMSON = "#c8102e";
const ROYAL = "#1f4fa3";
const SKIN = "#f7dcb4";

/**
 * Court cards and the joker: a half-length figure in the traditional
 * yellow / red / blue court-card style, mirrored point-symmetrically.
 * Everything is drawn from simple shapes; no bitmap artwork.
 */
function drawCourt(
  ctx: CanvasRenderingContext2D,
  ink: string,
  symbol: string,
  rank: string,
) {
  const x0 = 46;
  const y0 = 20;
  const w = TEX_W - x0 * 2;
  const h = TEX_H - y0 * 2;
  const cx = TEX_W / 2;

  const half = () => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, w, h / 2);
    ctx.clip();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x0, y0, w, h / 2);
    drawFigure(ctx, cx, y0, w, h / 2, rank);
    ctx.restore();

    // Suit mark in the panel's upper corner, opposite the prop.
    if (rank) {
      ctx.fillStyle = ink;
      ctx.font = `30px ${FONT}`;
      ctx.fillText(symbol, x0 + w - 20, y0 + 22);
    } else {
      ctx.fillStyle = BLACK;
      ctx.font = `28px ${FONT}`;
      ctx.fillText("★", x0 + w - 20, y0 + 22);
    }
  };

  half();
  withFlip(ctx, half);

  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 3;
  ctx.strokeRect(x0, y0, w, h);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, TEX_H / 2);
  ctx.lineTo(x0 + w, TEX_H / 2);
  ctx.stroke();
}

function shape(
  ctx: CanvasRenderingContext2D,
  fill: string,
  points: [number, number][],
) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawFigure(
  ctx: CanvasRenderingContext2D,
  cx: number,
  top: number,
  w: number,
  h: number,
  rank: string,
) {
  const left = cx - w / 2;
  const bottom = top + h;
  const headY = top + 62;
  const jester = rank === "";

  // Prop behind the figure.
  ctx.lineWidth = 5;
  ctx.strokeStyle = BLACK;
  if (rank === "K") {
    // Raised sword
    shape(ctx, "#d9dde3", [
      [left + 22, top + 14],
      [left + 28, top + 6],
      [left + 34, top + 14],
      [left + 34, top + 120],
      [left + 22, top + 120],
    ]);
    shape(ctx, GOLD, [
      [left + 10, top + 120],
      [left + 46, top + 120],
      [left + 46, top + 128],
      [left + 10, top + 128],
    ]);
  } else if (rank === "Q") {
    // Flower
    ctx.beginPath();
    ctx.moveTo(left + 30, top + 130);
    ctx.lineTo(left + 30, top + 40);
    ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        left + 30 + Math.cos(a) * 9,
        top + 34 + Math.sin(a) * 9,
        7,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = CRIMSON;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(left + 30, top + 34, 5, 0, Math.PI * 2);
    ctx.fillStyle = GOLD;
    ctx.fill();
  } else if (rank === "J") {
    // Halberd
    ctx.beginPath();
    ctx.moveTo(left + 28, top + 140);
    ctx.lineTo(left + 28, top + 16);
    ctx.stroke();
    shape(ctx, "#d9dde3", [
      [left + 28, top + 8],
      [left + 44, top + 26],
      [left + 28, top + 40],
      [left + 14, top + 26],
    ]);
  }

  // Robe: shoulders down to the center line.
  const sh = headY + 40;
  shape(ctx, jester ? ROYAL : GOLD, [
    [cx - 58, bottom],
    [cx - 54, sh + 6],
    [cx - 20, sh - 6],
    [cx + 20, sh - 6],
    [cx + 54, sh + 6],
    [cx + 58, bottom],
  ]);
  if (jester) {
    shape(ctx, CRIMSON, [
      [cx, sh - 6],
      [cx + 20, sh - 6],
      [cx + 54, sh + 6],
      [cx + 58, bottom],
      [cx, bottom],
    ]);
  } else {
    // Center panel and trim
    shape(ctx, CRIMSON, [
      [cx - 22, bottom],
      [cx - 16, sh],
      [cx + 16, sh],
      [cx + 22, bottom],
    ]);
    ctx.fillStyle = ROYAL;
    for (let y = sh + 18; y < bottom - 4; y += 22) {
      ctx.fillRect(cx - 50, y, 22, 6);
      ctx.fillRect(cx + 28, y, 22, 6);
    }
    ctx.fillStyle = GOLD;
    for (let y = sh + 12; y < bottom; y += 16) {
      ctx.beginPath();
      ctx.arc(cx, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Collar
  ctx.beginPath();
  ctx.ellipse(cx, sh - 2, 30, 12, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = BLACK;
  ctx.stroke();
  ctx.fillStyle = jester ? CRIMSON : ROYAL;
  for (let k = -2; k <= 2; k++) {
    ctx.beginPath();
    ctx.arc(cx + k * 11, sh - 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hair / beard behind and around the face.
  if (rank === "Q") {
    shape(ctx, GOLD, [
      [cx - 30, headY + 34],
      [cx - 28, headY - 18],
      [cx + 28, headY - 18],
      [cx + 30, headY + 34],
      [cx + 18, headY + 30],
      [cx - 18, headY + 30],
    ]);
  } else if (rank === "J") {
    shape(ctx, CRIMSON, [
      [cx - 27, headY + 22],
      [cx - 26, headY - 16],
      [cx + 26, headY - 16],
      [cx + 27, headY + 22],
      [cx + 20, headY + 16],
      [cx - 20, headY + 16],
    ]);
  }

  // Face
  ctx.beginPath();
  ctx.ellipse(cx, headY + 4, 20, 25, 0, 0, Math.PI * 2);
  ctx.fillStyle = SKIN;
  ctx.fill();
  ctx.strokeStyle = BLACK;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (rank === "K") {
    // Beard and moustache
    shape(ctx, GOLD, [
      [cx - 19, headY + 8],
      [cx - 12, headY + 34],
      [cx, headY + 40],
      [cx + 12, headY + 34],
      [cx + 19, headY + 8],
      [cx + 8, headY + 16],
      [cx - 8, headY + 16],
    ]);
  }

  // Eyes, nose, mouth
  ctx.fillStyle = BLACK;
  ctx.beginPath();
  ctx.arc(cx - 7, headY - 2, 2.2, 0, Math.PI * 2);
  ctx.arc(cx + 7, headY - 2, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx, headY);
  ctx.lineTo(cx - 3, headY + 9);
  ctx.lineTo(cx + 1, headY + 10);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (rank !== "K") {
    ctx.fillStyle = CRIMSON;
    ctx.fillRect(cx - 5, headY + 15, 10, 3);
  }

  // Headgear
  const hat = headY - 20;
  if (rank === "K") {
    shape(ctx, GOLD, [
      [cx - 22, hat + 4],
      [cx - 24, hat - 22],
      [cx - 12, hat - 10],
      [cx, hat - 28],
      [cx + 12, hat - 10],
      [cx + 24, hat - 22],
      [cx + 22, hat + 4],
    ]);
    ctx.fillStyle = CRIMSON;
    ctx.fillRect(cx - 21, hat - 4, 42, 6);
  } else if (rank === "Q") {
    shape(ctx, GOLD, [
      [cx - 20, hat + 2],
      [cx - 20, hat - 14],
      [cx - 10, hat - 6],
      [cx, hat - 18],
      [cx + 10, hat - 6],
      [cx + 20, hat - 14],
      [cx + 20, hat + 2],
    ]);
    ctx.fillStyle = ROYAL;
    ctx.fillRect(cx - 19, hat - 4, 38, 5);
    [
      [-20, -14],
      [0, -18],
      [20, -14],
    ].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx, hat + dy, 4, 0, Math.PI * 2);
      ctx.fillStyle = CRIMSON;
      ctx.fill();
    });
  } else if (rank === "J") {
    shape(ctx, CRIMSON, [
      [cx - 30, hat + 4],
      [cx - 18, hat - 16],
      [cx + 22, hat - 14],
      [cx + 30, hat + 4],
    ]);
    shape(ctx, GOLD, [
      [cx - 32, hat + 4],
      [cx + 32, hat + 4],
      [cx + 30, hat + 10],
      [cx - 30, hat + 10],
    ]);
    // Feather
    ctx.strokeStyle = ROYAL;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx + 14, hat - 10);
    ctx.quadraticCurveTo(cx + 40, hat - 30, cx + 46, hat - 8);
    ctx.stroke();
  } else {
    // Jester's two-pointed cap with bells
    shape(ctx, CRIMSON, [
      [cx - 22, hat + 6],
      [cx - 46, hat - 30],
      [cx - 4, hat - 8],
      [cx, hat + 6],
    ]);
    shape(ctx, ROYAL, [
      [cx, hat + 6],
      [cx + 4, hat - 8],
      [cx + 46, hat - 30],
      [cx + 22, hat + 6],
    ]);
    [
      [-46, -30],
      [46, -30],
    ].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx, hat + dy, 6, 0, Math.PI * 2);
      ctx.fillStyle = GOLD;
      ctx.fill();
      ctx.strokeStyle = BLACK;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}

function backTexture() {
  return makeTexture("back", (ctx) => {
    ctx.fillStyle = "#1d1d1f";
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    ctx.strokeStyle = "#6e6e73";
    ctx.lineWidth = 4;
    ctx.strokeRect(18, 18, TEX_W - 36, TEX_H - 36);
    ctx.lineWidth = 2;
    for (let x = 18; x <= TEX_W - 18; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 18);
      ctx.lineTo(x, TEX_H - 18);
      ctx.stroke();
    }
  });
}

// ---------- hooks ----------

/** Widen the shot on narrow (portrait) stages so all five seats stay in frame. */
function CameraRig({
  onProject,
}: {
  /** Receives each seat's label position in canvas pixels. */
  onProject: (points: { x: number; y: number }[]) => void;
}) {
  const { camera, size } = useThree();
  useEffect(() => {
    const k = zoomFor(size.width / size.height);
    camera.position.set(0, 8.2 * k, 7.2 * k);
    camera.lookAt(0, 0, 0.7);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();

    onProject(
      Array.from({ length: PLAYERS }, (_, p) => {
        const v = new THREE.Vector3(...seatPoint(p, 1.02, 0.05)).project(
          camera,
        );
        return {
          x: ((v.x + 1) / 2) * size.width,
          y: ((1 - v.y) / 2) * size.height,
        };
      }),
    );
  }, [camera, size, onProject]);
  return null;
}

function zoomFor(aspect: number) {
  return aspect < 1.35 ? Math.min(1.35 / aspect, 2) : 0.86;
}

function useZoom() {
  const { size } = useThree();
  return zoomFor(size.width / size.height);
}

function useCollecting(game: GameState) {
  const [collecting, setCollecting] = useState(false);
  const ending = game.phase === "trickEnd";
  useEffect(() => {
    setCollecting(false);
    if (!ending) return;
    const timer = setTimeout(() => setCollecting(true), COLLECT_DELAY);
    return () => clearTimeout(timer);
  }, [ending, game.trickNo]);
  return collecting;
}

function useThemeColors() {
  const [colors, setColors] = useState({ border: "#ebebeb", muted: "#6e6e73" });
  useEffect(() => {
    const read = () => {
      const style = getComputedStyle(document.documentElement);
      setColors({
        border: style.getPropertyValue("--border").trim() || "#ebebeb",
        muted: style.getPropertyValue("--muted").trim() || "#6e6e73",
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
  return colors;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

function setCursor(pointer: boolean) {
  document.body.style.cursor = pointer ? "pointer" : "";
}
