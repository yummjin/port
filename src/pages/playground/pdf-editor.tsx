import Head from "next/head";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
} from "react-icons/ri";

import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { buildPdf, countPages, renderThumbnails } from "@/lib/pdf";

type PdfFile = { id: string; name: string; pageCount: number };
type Page = {
  id: string;
  fileId: string;
  pageIndex: number;
  thumbnail?: string;
};

let nextId = 1;
const createId = (prefix: string) => `${prefix}-${nextId++}`;

function move<T>(items: T[], from: number, to: number) {
  if (to < 0 || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)}KB`;
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}

export default function PdfEditorPage() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<{ url: string; size: number } | null>(
    null,
  );
  const [building, setBuilding] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropZone, setDropZone] = useState(false);
  const bytesRef = useRef(new Map<string, ArrayBuffer>());

  // A new page order invalidates the previous export.
  useEffect(() => {
    setOutput((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  }, [pages]);

  const addFiles = async (list: FileList | File[]) => {
    const pdfs = [...list].filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf"),
    );
    if (pdfs.length === 0) {
      setError("PDF 파일만 추가할 수 있어요.");
      return;
    }
    setError(null);
    setLoading((n) => n + pdfs.length);

    for (const file of pdfs) {
      try {
        const bytes = await file.arrayBuffer();
        const pageCount = await countPages(bytes);
        const fileId = createId("file");
        bytesRef.current.set(fileId, bytes);
        const newPages = Array.from({ length: pageCount }, (_, pageIndex) => ({
          id: createId("page"),
          fileId,
          pageIndex,
        }));
        setFiles((current) => [
          ...current,
          { id: fileId, name: file.name, pageCount },
        ]);
        setPages((current) => [...current, ...newPages]);

        renderThumbnails(bytes)
          .then((thumbnails) =>
            setPages((current) =>
              current.map((page) =>
                page.fileId === fileId
                  ? { ...page, thumbnail: thumbnails[page.pageIndex] }
                  : page,
              ),
            ),
          )
          .catch(() => undefined);
      } catch {
        setError(
          `${file.name}을(를) 읽지 못했어요. 암호가 걸렸거나 손상된 파일일 수 있어요.`,
        );
      } finally {
        setLoading((n) => n - 1);
      }
    }
  };

  const onInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) void addFiles(event.target.files);
    event.target.value = "";
  };

  const onDropFiles = (event: DragEvent) => {
    event.preventDefault();
    setDropZone(false);
    if (event.dataTransfer.files.length)
      void addFiles(event.dataTransfer.files);
  };

  const moveFile = (fileId: string, direction: -1 | 1) => {
    const index = files.findIndex((file) => file.id === fileId);
    const nextFiles = move(files, index, index + direction);
    if (nextFiles === files) return;
    setFiles(nextFiles);
    const order = new Map(nextFiles.map((file, i) => [file.id, i]));
    setPages((current) =>
      [...current].sort((a, b) => order.get(a.fileId)! - order.get(b.fileId)!),
    );
  };

  const removeFile = (fileId: string) => {
    bytesRef.current.delete(fileId);
    setFiles((current) => current.filter((file) => file.id !== fileId));
    setPages((current) => current.filter((page) => page.fileId !== fileId));
  };

  const removePage = (pageId: string) =>
    setPages((current) => current.filter((page) => page.id !== pageId));

  const onBuild = async () => {
    setBuilding(true);
    setError(null);
    try {
      const bytes = await buildPdf(bytesRef.current, pages);
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      setOutput({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBuilding(false);
    }
  };

  const fileIndex = new Map(files.map((file, i) => [file.id, i]));
  const fileName = new Map(files.map((file) => [file.id, file.name]));

  return (
    <>
      <Head>
        <title>PDF 편집기</title>
        <meta name="description" content="PDF 병합과 페이지 순서 변경" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <div className="flex flex-col gap-2">
          <Link href="/playground" className="text-caption text-muted w-fit">
            ‹ Playground
          </Link>
          <h1 className="text-section text-foreground">PDF 편집기</h1>
          <p className="text-body-small text-secondary">
            여러 PDF를 합치고 페이지 순서를 바꿔요. 파일은 브라우저 안에서만
            처리되고 서버로 전송되지 않아요.
          </p>
        </div>

        <label
          onDragOver={(event) => {
            event.preventDefault();
            setDropZone(true);
          }}
          onDragLeave={() => setDropZone(false)}
          onDrop={onDropFiles}
          className={cn(
            "text-body-small flex cursor-pointer flex-col items-center gap-1 border border-dashed px-4 py-8 text-center transition-colors",
            dropZone
              ? "border-foreground text-foreground"
              : "border-border text-muted hover:text-foreground",
          )}
        >
          <span>PDF를 끌어다 놓거나 눌러서 선택하세요</span>
          <span className="text-caption">
            여러 개를 한 번에 추가할 수 있어요
          </span>
          <input
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="sr-only"
            onChange={onInput}
          />
        </label>

        {loading > 0 && (
          <p className="text-caption text-muted" aria-live="polite">
            불러오는 중이에요.
          </p>
        )}
        {error && <p className="text-body-small text-danger">{error}</p>}

        {files.length > 0 && (
          <Section title={`파일 ${files.length}개`}>
            <ol className="flex flex-col gap-1.5">
              {files.map((file, index) => (
                <li
                  key={file.id}
                  className="border-border text-body-small flex items-center border"
                >
                  <span className="border-border text-muted w-9 shrink-0 border-r py-1 text-center">
                    {index + 1}
                  </span>
                  <span className="text-foreground min-w-0 flex-1 truncate px-3 py-1">
                    {file.name}
                  </span>
                  <span className="text-caption text-muted px-3">
                    {file.pageCount}쪽
                  </span>
                  <IconButton
                    label="위로"
                    onClick={() => moveFile(file.id, -1)}
                    disabled={index === 0}
                  >
                    <RiArrowLeftSLine className="rotate-90" />
                  </IconButton>
                  <IconButton
                    label="아래로"
                    onClick={() => moveFile(file.id, 1)}
                    disabled={index === files.length - 1}
                  >
                    <RiArrowRightSLine className="rotate-90" />
                  </IconButton>
                  <IconButton
                    label="파일 제거"
                    onClick={() => removeFile(file.id)}
                  >
                    <RiCloseLine />
                  </IconButton>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {pages.length > 0 && (
          <Section
            title={`페이지 ${pages.length}쪽 — 끌어서 순서를 바꿀 수 있어요`}
          >
            <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {pages.map((page, index) => (
                <li
                  key={page.id}
                  draggable
                  onDragStart={(event) => {
                    setDragIndex(index);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(event) => {
                    if (dragIndex === null) return;
                    event.preventDefault();
                    if (dragIndex !== index) {
                      setPages((current) => move(current, dragIndex, index));
                      setDragIndex(index);
                    }
                  }}
                  onDrop={(event) => event.preventDefault()}
                  onDragEnd={() => setDragIndex(null)}
                  className={cn(
                    "flex cursor-grab flex-col gap-1.5 active:cursor-grabbing",
                    dragIndex === index && "opacity-40",
                  )}
                >
                  <div className="border-border bg-canvas relative flex aspect-[3/4] items-center justify-center overflow-hidden border">
                    {page.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={page.thumbnail}
                        alt=""
                        draggable={false}
                        className="size-full object-contain"
                      />
                    ) : (
                      <span className="text-caption text-muted">
                        {page.pageIndex + 1}
                      </span>
                    )}
                    <span className="border-border bg-surface text-caption text-foreground absolute top-0 left-0 border-r border-b px-1.5">
                      {index + 1}
                    </span>
                  </div>
                  <div className="border-border text-caption flex items-stretch border">
                    <span
                      className="text-muted min-w-0 flex-1 truncate px-1.5 py-0.5"
                      title={fileName.get(page.fileId)}
                    >
                      {fileIndex.get(page.fileId)! + 1}·{page.pageIndex + 1}
                    </span>
                    <IconButton
                      label="앞으로"
                      onClick={() => setPages((c) => move(c, index, index - 1))}
                      disabled={index === 0}
                    >
                      <RiArrowLeftSLine />
                    </IconButton>
                    <IconButton
                      label="뒤로"
                      onClick={() => setPages((c) => move(c, index, index + 1))}
                      disabled={index === pages.length - 1}
                    >
                      <RiArrowRightSLine />
                    </IconButton>
                    <IconButton
                      label="페이지 삭제"
                      onClick={() => removePage(page.id)}
                    >
                      <RiCloseLine />
                    </IconButton>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {pages.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="compact" onClick={onBuild} disabled={building}>
              {building ? "만드는 중" : `PDF 만들기 (${pages.length}쪽)`}
            </Button>
            {output && (
              <>
                <a
                  href={output.url}
                  download="merged.pdf"
                  className="text-link text-body-small"
                >
                  merged.pdf 다운로드
                </a>
                <span className="text-caption text-muted">
                  {formatBytes(output.size)}
                </span>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-caption text-muted">{title}</h2>
      {children}
    </section>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="border-border text-foreground flex min-h-9 w-9 shrink-0 cursor-pointer items-center justify-center border-l transition-opacity hover:opacity-70 disabled:cursor-default disabled:opacity-30"
    >
      {children}
    </button>
  );
}
