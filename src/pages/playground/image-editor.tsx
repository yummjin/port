import Head from "next/head";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { composeToPng, type ComposeResult } from "@/lib/compose";

type LayerType = "image" | "text" | "rect";

type Layer = {
  id: string;
  type: LayerType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  radius: number;
  fill: string;
  src?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
};

const PRESETS = [
  { label: "OG 1200×630", width: 1200, height: 630 },
  { label: "정사각 1080", width: 1080, height: 1080 },
  { label: "스토리 1080×1920", width: 1080, height: 1920 },
  { label: "작게 600×400", width: 600, height: 400 },
];

let nextId = 1;
const createId = () => `layer-${nextId++}`;

const INITIAL_LAYERS: Layer[] = [
  {
    id: "layer-bg-rect",
    type: "rect",
    name: "사각형",
    x: 60,
    y: 60,
    width: 480,
    height: 280,
    rotation: 0,
    opacity: 1,
    radius: 0,
    fill: "#0071e3",
  },
  {
    id: "layer-title",
    type: "text",
    name: "텍스트",
    x: 100,
    y: 150,
    width: 400,
    height: 80,
    rotation: 0,
    opacity: 1,
    radius: 0,
    fill: "transparent",
    text: "HTML → Image",
    fontSize: 48,
    fontWeight: 600,
    color: "#ffffff",
  },
];

export default function ImageEditorPage() {
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [background, setBackground] = useState("#f5f5f7");
  const [layers, setLayers] = useState<Layer[]>(INITIAL_LAYERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [result, setResult] = useState<ComposeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const selected = layers.find((layer) => layer.id === selectedId) ?? null;

  const updateLayer = (id: string, patch: Partial<Layer>) =>
    setLayers((current) =>
      current.map((layer) =>
        layer.id === id ? { ...layer, ...patch } : layer,
      ),
    );

  const addLayer = (layer: Omit<Layer, "id">) => {
    const id = createId();
    setLayers((current) => [...current, { ...layer, id }]);
    setSelectedId(id);
  };

  const base = {
    x: Math.round(size.width / 2 - 100),
    y: Math.round(size.height / 2 - 60),
    width: 200,
    height: 120,
    rotation: 0,
    opacity: 1,
    radius: 0,
  };

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          (size.width * 0.6) / image.naturalWidth,
          (size.height * 0.6) / image.naturalHeight,
        );
        addLayer({
          ...base,
          type: "image",
          name: file.name,
          width: Math.round(image.naturalWidth * scale),
          height: Math.round(image.naturalHeight * scale),
          fill: "transparent",
          src,
        });
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  };

  const onPointerDown = (event: ReactPointerEvent, layer: Layer) => {
    event.stopPropagation();
    setSelectedId(layer.id);
    dragRef.current = {
      id: layer.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: layer.x,
      originY: layer.y,
    };
  };

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      updateLayer(drag.id, {
        x: Math.round(drag.originX + event.clientX - drag.startX),
        y: Math.round(drag.originY + event.clientY - drag.startY),
      });
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  const moveLayer = (id: string, direction: -1 | 1) =>
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === id);
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const removeLayer = (id: string) => {
    setLayers((current) => current.filter((layer) => layer.id !== id));
    setSelectedId(null);
  };

  const onExport = async () => {
    if (!stageRef.current) return;
    setExporting(true);
    setError(null);
    try {
      setResult(await composeToPng(stageRef.current, size));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Head>
        <title>이미지 편집기</title>
        <meta
          name="description"
          content="HTML 이미지 합성 라이브러리를 실험하는 이미지 편집기"
        />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <div className="flex flex-col gap-2">
          <Link href="/playground" className="text-caption text-muted w-fit">
            ‹ Playground
          </Link>
          <h1 className="text-section text-[22px]">이미지 편집기</h1>
          <p className="text-body-small text-secondary">
            HTML 요소로 만든 스테이지를 이미지로 합성해보는 실험 공간이에요.
            내보내기는 <code>src/lib/compose.ts</code>의 어댑터를 거쳐요.
          </p>
        </div>

        <Toolbar>
          <label className="border-border text-body-small text-foreground hover:border-foreground cursor-pointer border px-3 py-1 transition-colors">
            이미지 추가
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onUpload}
            />
          </label>
          <ToolButton
            onClick={() =>
              addLayer({
                ...base,
                type: "text",
                name: "텍스트",
                fill: "transparent",
                text: "텍스트",
                fontSize: 32,
                fontWeight: 600,
                color: "#1d1d1f",
              })
            }
          >
            텍스트 추가
          </ToolButton>
          <ToolButton
            onClick={() =>
              addLayer({
                ...base,
                type: "rect",
                name: "사각형",
                fill: "#1d1d1f",
              })
            }
          >
            사각형 추가
          </ToolButton>
          <span className="bg-border mx-1 hidden h-6 w-px sm:block" />
          {PRESETS.map((preset) => (
            <ToolButton
              key={preset.label}
              selected={
                size.width === preset.width && size.height === preset.height
              }
              onClick={() =>
                setSize({ width: preset.width, height: preset.height })
              }
            >
              {preset.label}
            </ToolButton>
          ))}
        </Toolbar>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
          <div className="border-border bg-canvas overflow-auto border p-4">
            <div
              ref={stageRef}
              onPointerDown={() => setSelectedId(null)}
              className="relative overflow-hidden"
              style={{
                width: size.width,
                height: size.height,
                background,
              }}
            >
              {layers.map((layer) => (
                <LayerView
                  key={layer.id}
                  layer={layer}
                  selected={layer.id === selectedId}
                  onPointerDown={(event) => onPointerDown(event, layer)}
                />
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-4">
            <Section title="스테이지">
              <Field label="너비">
                <NumberInput
                  value={size.width}
                  onChange={(width) => setSize((s) => ({ ...s, width }))}
                />
              </Field>
              <Field label="높이">
                <NumberInput
                  value={size.height}
                  onChange={(height) => setSize((s) => ({ ...s, height }))}
                />
              </Field>
              <Field label="배경">
                <ColorInput value={background} onChange={setBackground} />
              </Field>
            </Section>

            <Section title="레이어">
              {layers.length === 0 && (
                <p className="text-caption text-muted">레이어가 없어요.</p>
              )}
              <ol className="flex flex-col-reverse gap-1">
                {layers.map((layer) => (
                  <li key={layer.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(layer.id)}
                      className={cn(
                        "text-body-small w-full cursor-pointer truncate border px-2 py-1 text-left transition-colors",
                        layer.id === selectedId
                          ? "border-foreground text-foreground"
                          : "border-border text-muted hover:text-foreground",
                      )}
                    >
                      {layer.name}
                    </button>
                  </li>
                ))}
              </ol>
            </Section>

            {selected && (
              <Section title={`속성 — ${selected.name}`}>
                {(
                  ["x", "y", "width", "height", "rotation", "radius"] as const
                ).map((key) => (
                  <Field key={key} label={FIELD_LABELS[key]}>
                    <NumberInput
                      value={selected[key]}
                      onChange={(value) =>
                        updateLayer(selected.id, { [key]: value })
                      }
                    />
                  </Field>
                ))}
                <Field label="불투명도">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={selected.opacity}
                    onChange={(event) =>
                      updateLayer(selected.id, {
                        opacity: Number(event.target.value),
                      })
                    }
                    className="w-full"
                  />
                </Field>
                <Field label="채우기">
                  <ColorInput
                    value={selected.fill}
                    onChange={(fill) => updateLayer(selected.id, { fill })}
                  />
                </Field>
                {selected.type === "text" && (
                  <>
                    <Field label="내용">
                      <input
                        value={selected.text ?? ""}
                        onChange={(event) =>
                          updateLayer(selected.id, { text: event.target.value })
                        }
                        className="border-border text-body-small w-full border bg-transparent px-2 py-1"
                      />
                    </Field>
                    <Field label="크기">
                      <NumberInput
                        value={selected.fontSize ?? 32}
                        onChange={(fontSize) =>
                          updateLayer(selected.id, { fontSize })
                        }
                      />
                    </Field>
                    <Field label="굵기">
                      <NumberInput
                        value={selected.fontWeight ?? 400}
                        step={100}
                        onChange={(fontWeight) =>
                          updateLayer(selected.id, { fontWeight })
                        }
                      />
                    </Field>
                    <Field label="글자색">
                      <ColorInput
                        value={selected.color ?? "#000000"}
                        onChange={(color) =>
                          updateLayer(selected.id, { color })
                        }
                      />
                    </Field>
                  </>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <ToolButton onClick={() => moveLayer(selected.id, 1)}>
                    앞으로
                  </ToolButton>
                  <ToolButton onClick={() => moveLayer(selected.id, -1)}>
                    뒤로
                  </ToolButton>
                  <ToolButton onClick={() => removeLayer(selected.id)}>
                    삭제
                  </ToolButton>
                </div>
              </Section>
            )}
          </aside>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="compact" onClick={onExport} disabled={exporting}>
              {exporting ? "합성 중" : "PNG로 내보내기"}
            </Button>
            {result && (
              <>
                <span className="text-caption text-muted">
                  {result.durationMs.toFixed(0)}ms · {size.width}×{size.height}{" "}
                  @2x
                </span>
                <a
                  href={result.dataUrl}
                  download="composed.png"
                  className="text-link text-body-small"
                >
                  다운로드
                </a>
              </>
            )}
          </div>
          {error && <p className="text-body-small text-[#d70015]">{error}</p>}
          {result && (
            <div className="border-border bg-canvas overflow-auto border p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.dataUrl}
                alt="합성 결과"
                style={{ width: size.width, height: size.height }}
                className="max-w-none"
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
}

const FIELD_LABELS = {
  x: "X",
  y: "Y",
  width: "너비",
  height: "높이",
  rotation: "회전",
  radius: "모서리",
} as const;

function LayerView({
  layer,
  selected,
  onPointerDown,
}: {
  layer: Layer;
  selected: boolean;
  onPointerDown: (event: ReactPointerEvent) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="absolute cursor-move touch-none select-none"
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity,
        transform: `rotate(${layer.rotation}deg)`,
        background: layer.fill,
        borderRadius: layer.radius,
        overflow: "hidden",
      }}
    >
      {layer.type === "image" && layer.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={layer.src}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}
      {layer.type === "text" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            fontSize: layer.fontSize,
            fontWeight: layer.fontWeight,
            color: layer.color,
            lineHeight: 1.2,
            whiteSpace: "pre-wrap",
          }}
        >
          {layer.text}
        </div>
      )}
      {selected && (
        <div
          data-compose-ignore
          className="pointer-events-none absolute inset-0 outline-2 -outline-offset-2 outline-[#0071e3]"
        />
      )}
    </div>
  );
}

function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-1.5">{children}</div>;
}

function ToolButton({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "text-body-small cursor-pointer border px-3 py-1 transition-colors duration-150",
        selected
          ? "border-foreground text-foreground"
          : "border-border text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border flex flex-col gap-2 border p-3">
      <h2 className="text-caption text-muted">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-2">
      <span className="text-caption text-muted">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  step = 1,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={value}
      step={step}
      onChange={(event) => onChange(Number(event.target.value) || 0)}
      className="border-border text-body-small w-full border bg-transparent px-2 py-1"
    />
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const isHex = /^#[0-9a-f]{6}$/i.test(value);
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={isHex ? value : "#ffffff"}
        onChange={(event) => onChange(event.target.value)}
        className="border-border h-7 w-9 cursor-pointer border bg-transparent"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border-border text-caption min-w-0 flex-1 border bg-transparent px-2 py-1"
      />
    </div>
  );
}
