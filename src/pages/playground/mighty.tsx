import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { FiMaximize, FiMinimize } from "react-icons/fi";

import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import {
  JOKER,
  MAX_BID,
  PLAYER_NAMES,
  PLAYERS,
  SUIT_SYMBOL,
  SUITS,
  applyBid,
  applyExchange,
  applyPlay,
  botBid,
  botExchange,
  botPlay,
  cardLabel,
  collectTrick,
  friendOptions,
  jokerCallOf,
  legalCards,
  minimumBid,
  newRound,
  sortHand,
  trumpLabel,
  type CardId,
  type GameState,
  type Trump,
} from "@/lib/mighty";

const Table3D = dynamic(() => import("@/components/mighty/Table3D"), {
  ssr: false,
  loading: () => (
    <div className="text-caption text-muted flex size-full items-center justify-center">
      테이블을 불러오는 중이에요.
    </div>
  ),
});

const ME = 0;
const BOT_DELAY = 550;
const TRICK_PAUSE = 1000;

export default function MightyPage() {
  const [game, setGame] = useState<GameState | null>(null);

  // Deal on the client only: the shuffle is random, so a server-rendered deal
  // would not match the hydrated one.
  useEffect(() => setGame(newRound()), []);

  // Bots act on their own turn; finished tricks pause briefly before collecting.
  useEffect(() => {
    if (!game) return;
    const { phase, turn, declarer } = game;
    let step: ((g: GameState) => GameState) | null = null;
    let delay = BOT_DELAY;

    if (phase === "trickEnd") {
      step = collectTrick;
      delay = TRICK_PAUSE;
    } else if (phase === "bidding" && turn !== ME) {
      step = (g) => applyBid(g, g.turn, botBid(g, g.turn));
    } else if (phase === "exchange" && declarer !== ME) {
      step = (g) => {
        const { discards, friendCard } = botExchange(g);
        return applyExchange(g, discards, friendCard);
      };
    } else if (phase === "playing" && turn !== ME) {
      step = (g) => {
        const move = botPlay(g, g.turn);
        return applyPlay(g, g.turn, move.card, move);
      };
    }

    if (!step) return;
    const timer = setTimeout(() => setGame((g) => (g ? step(g) : g)), delay);
    return () => clearTimeout(timer);
  }, [game]);

  return (
    <>
      <Head>
        <title>마이티</title>
        <meta name="description" content="5명이 모이면 마이티" />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <div className="flex flex-col gap-2">
          <h1 className="text-section text-foreground">마이티</h1>
          <p className="text-body-small text-secondary">
            5명이 모이면? 마이티~
          </p>
        </div>

        {game ? (
          <Table game={game} setGame={setGame} />
        ) : (
          <div className="border-border bg-canvas h-[460px] border sm:h-[600px]" />
        )}
      </main>
    </>
  );
}

function Table({
  game,
  setGame,
}: {
  game: GameState;
  setGame: (update: (g: GameState | null) => GameState | null) => void;
}) {
  const myTurn = game.turn === ME;
  const exchanging = game.phase === "exchange" && game.declarer === ME;
  const canPlay = game.phase === "playing" && myTurn;

  const [pending, setPending] = useState<CardId | null>(null);
  const [discards, setDiscards] = useState<CardId[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const fullscreen = useFullscreen(stage);

  const legal = useMemo(
    () => (canPlay ? legalCards(game, ME) : []),
    [canPlay, game],
  );
  const hand = sortHand(game.hands[ME], game.trump);
  const clickable = exchanging ? hand : canPlay ? legal : [];
  const dimmed = canPlay ? hand.filter((card) => !legal.includes(card)) : [];
  const raised = exchanging ? discards : pending ? [pending] : [];

  const play = (card: CardId, options = {}) => {
    setPending(null);
    setGame((g) => g && applyPlay(g, ME, card, options));
  };

  const onCardClick = (card: CardId) => {
    if (exchanging) {
      setDiscards((current) =>
        current.includes(card)
          ? current.filter((c) => c !== card)
          : current.length < 3
            ? [...current, card]
            : current,
      );
      return;
    }
    if (!legal.includes(card)) return;
    const leading = game.trick.length === 0;
    const canCall =
      leading &&
      card === jokerCallOf(game.trump) &&
      game.trickNo > 0 &&
      !game.jokerPlayed;
    if (leading && (card === JOKER || canCall)) {
      setPending((current) => (current === card ? null : card));
      return;
    }
    play(card);
  };

  const me =
    game.declarer === ME ? "주공" : game.friend === ME ? "프렌드" : null;

  return (
    <div className="flex flex-col gap-6">
      <div
        ref={stage}
        className={cn(
          "border-border bg-canvas relative overflow-hidden",
          fullscreen.active
            ? "h-screen w-screen"
            : "h-[460px] border sm:h-[600px]",
        )}
      >
        {fullscreen.supported && (
          <button
            type="button"
            onClick={fullscreen.toggle}
            aria-label={fullscreen.active ? "전체 화면 종료" : "전체 화면"}
            title={fullscreen.active ? "전체 화면 종료" : "전체 화면"}
            className="bg-surface border-border text-foreground absolute top-3 right-3 z-40 flex size-9 cursor-pointer items-center justify-center border transition-opacity hover:opacity-70"
          >
            {fullscreen.active ? (
              <FiMinimize size={16} />
            ) : (
              <FiMaximize size={16} />
            )}
          </button>
        )}

        <Table3D
          game={game}
          clickable={clickable}
          dimmed={dimmed}
          raised={raised}
          onCardClick={onCardClick}
        />

        <div
          className={cn(
            "bg-surface text-caption pointer-events-none absolute bottom-3 left-3 z-30 flex flex-col border px-2 py-1",
            myTurn && game.phase !== "result" && game.phase !== "trickEnd"
              ? "border-foreground"
              : "border-border",
          )}
        >
          <span className="text-foreground font-medium">
            {PLAYER_NAMES[ME]}
            {me && <span className="text-muted font-normal"> · {me}</span>}
          </span>
        </div>

        <p
          aria-live="polite"
          className="bg-surface border-border text-caption text-foreground pointer-events-none absolute right-3 bottom-3 z-30 max-w-[60%] border px-2 py-1"
        >
          {statusText(game)}
        </p>

        <div className="pointer-events-none absolute inset-x-3 top-3 z-30 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 pr-12">
            <InfoBox label="주공">
              {game.declarer === null ? "–" : PLAYER_NAMES[game.declarer]}
            </InfoBox>
            <InfoBox label="기루다">
              {game.trump ? trumpLabel(game.trump) : "–"}
            </InfoBox>
            <InfoBox label="공약">
              {game.highestBid ? game.highestBid.points : "–"}
            </InfoBox>
            <InfoBox label="프렌드">
              {game.phase === "bidding" || game.phase === "exchange"
                ? "–"
                : game.friendCard
                  ? `${cardLabel(game.friendCard)}${game.friendRevealed && game.friend !== null ? ` · ${PLAYER_NAMES[game.friend]}` : " · 미공개"}`
                  : "없음"}
            </InfoBox>
            <InfoBox label="트릭">
              {Math.min(game.trickNo + 1, 10)} / 10
            </InfoBox>
          </div>

          <div className="pointer-events-auto mx-auto flex w-full max-w-[460px] flex-col gap-3">
            {game.phase === "bidding" && myTurn && (
              <BidPanel
                game={game}
                onBid={(bid) => setGame((g) => g && applyBid(g, ME, bid))}
              />
            )}

            {exchanging && (
              <ExchangePanel
                game={game}
                discards={discards}
                onConfirm={(friendCard) => {
                  setGame((g) => g && applyExchange(g, discards, friendCard));
                  setDiscards([]);
                }}
              />
            )}

            {game.phase === "result" && game.result && (
              <ResultPanel
                game={game}
                onNext={() =>
                  setGame(
                    (g) => g && newRound(g.scores, (g.starter + 1) % PLAYERS),
                  )
                }
              />
            )}

            {pending === JOKER && (
              <Panel title="조커로 요청할 무늬">
                <div className="flex flex-wrap gap-1.5">
                  {SUITS.map((suit) => (
                    <ChoiceButton
                      key={suit}
                      onClick={() => play(JOKER, { jokerSuit: suit })}
                    >
                      {SUIT_SYMBOL[suit]}
                    </ChoiceButton>
                  ))}
                  <ChoiceButton onClick={() => setPending(null)}>
                    취소
                  </ChoiceButton>
                </div>
              </Panel>
            )}

            {pending && pending !== JOKER && (
              <Panel title={`${cardLabel(pending)}로 조커콜 할까요?`}>
                <div className="flex flex-wrap gap-1.5">
                  <ChoiceButton
                    onClick={() => play(pending, { jokerCall: true })}
                  >
                    조커콜
                  </ChoiceButton>
                  <ChoiceButton onClick={() => play(pending)}>
                    그냥 내기
                  </ChoiceButton>
                  <ChoiceButton onClick={() => setPending(null)}>
                    취소
                  </ChoiceButton>
                </div>
              </Panel>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard and screen-reader access to the hand drawn in the 3D scene */}
      <div className="sr-only">
        <span>내 패</span>
        {hand.map((card) => (
          <button
            key={card}
            type="button"
            disabled={!clickable.includes(card)}
            aria-pressed={raised.includes(card)}
            onClick={() => onCardClick(card)}
          >
            {cardLabel(card)}
          </button>
        ))}
      </div>
    </div>
  );
}

function statusText(game: GameState) {
  const name = PLAYER_NAMES[game.turn];
  switch (game.phase) {
    case "bidding":
      return game.turn === ME
        ? "공약을 걸거나 패스하세요."
        : `${name}이(가) 고민 중이에요.`;
    case "exchange":
      return game.declarer === ME
        ? "버릴 카드 3장과 프렌드를 정하세요."
        : `${PLAYER_NAMES[game.declarer!]}이(가) 카드를 고르는 중이에요.`;
    case "playing":
      return game.turn === ME ? "낼 카드를 고르세요." : `${name}의 차례예요.`;
    case "trickEnd":
      return `${PLAYER_NAMES[game.trickWinner!]}이(가) 이번 트릭을 가져가요.`;
    case "result":
      return "라운드가 끝났어요.";
  }
}

function InfoBox({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-border bg-surface text-body-small flex border">
      <span className="border-border text-muted border-r px-3 py-1">
        {label}
      </span>
      <span className="text-foreground px-3 py-1">{children}</span>
    </div>
  );
}

function BidPanel({
  game,
  onBid,
}: {
  game: GameState;
  onBid: (bid: { points: number; trump: Trump } | null) => void;
}) {
  const [trump, setTrump] = useState<Trump>("S");
  const min = minimumBid(game.highestBid, trump);
  const [points, setPoints] = useState(min);
  const value = Math.max(points, min);
  const canBid = min <= MAX_BID;

  return (
    <Panel title="공약">
      <ChoiceRow label="기루다">
        {([...SUITS, "N"] as Trump[]).map((t) => (
          <ChoiceButton
            key={t}
            selected={trump === t}
            onClick={() => setTrump(t)}
          >
            {trumpLabel(t)}
          </ChoiceButton>
        ))}
      </ChoiceRow>
      <ChoiceRow label="점수">
        {Array.from({ length: MAX_BID - min + 1 }, (_, i) => min + i).map(
          (n) => (
            <ChoiceButton
              key={n}
              selected={value === n}
              onClick={() => setPoints(n)}
            >
              {n}
            </ChoiceButton>
          ),
        )}
      </ChoiceRow>
      <div className="flex gap-2">
        <Button
          variant="compact"
          disabled={!canBid}
          onClick={() => onBid({ points: value, trump })}
        >
          {trumpLabel(trump)} {value} 공약
        </Button>
        <Button
          variant="compact"
          className="border-border text-foreground border bg-transparent"
          onClick={() => onBid(null)}
        >
          패스
        </Button>
      </div>
    </Panel>
  );
}

function ExchangePanel({
  game,
  discards,
  onConfirm,
}: {
  game: GameState;
  discards: CardId[];
  onConfirm: (friendCard: CardId | null) => void;
}) {
  const options = friendOptions(game);
  const [friendCard, setFriendCard] = useState<CardId | null>(
    options[0] ?? null,
  );

  return (
    <Panel title={`카드 교환 — 테이블에서 버릴 카드 ${discards.length} / 3`}>
      <ChoiceRow label="프렌드">
        {options.map((card) => (
          <ChoiceButton
            key={card}
            selected={friendCard === card}
            onClick={() => setFriendCard(card)}
          >
            {cardLabel(card)}
          </ChoiceButton>
        ))}
        <ChoiceButton
          selected={friendCard === null}
          onClick={() => setFriendCard(null)}
        >
          노프렌드
        </ChoiceButton>
      </ChoiceRow>
      <div>
        <Button
          variant="compact"
          disabled={discards.length !== 3}
          onClick={() => onConfirm(friendCard)}
        >
          확정
        </Button>
      </div>
    </Panel>
  );
}

function ResultPanel({
  game,
  onNext,
}: {
  game: GameState;
  onNext: () => void;
}) {
  const result = game.result!;
  return (
    <Panel
      title={`${result.win ? "주공 승리" : "주공 패배"} - 주공 팀 ${result.teamPoints}점 / 공약 ${game.contract}`}
    >
      <div className="flex flex-wrap gap-2">
        {result.deltas.map((delta, p) => (
          <InfoBox key={p} label={PLAYER_NAMES[p]}>
            {delta > 0 ? `+${delta}` : delta}
          </InfoBox>
        ))}
      </div>
      <div>
        <Button variant="compact" onClick={onNext}>
          다음 판
        </Button>
      </div>
    </Panel>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border bg-surface flex flex-col gap-4 border p-4">
      <h2 className="text-body-small text-foreground font-medium">{title}</h2>
      {children}
    </section>
  );
}

function ChoiceRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-muted">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function ChoiceButton({
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
        "text-body-small min-h-9 min-w-9 cursor-pointer border px-2.5 py-1 transition-colors duration-150",
        selected
          ? "border-foreground text-foreground"
          : "border-border text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/** Fullscreen for one element, tracking exits made with Esc or the browser UI. */
function useFullscreen(ref: React.RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(document.fullscreenEnabled);
    const onChange = () =>
      setActive(document.fullscreenElement === ref.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [ref]);

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void ref.current?.requestFullscreen();
    }
  };

  return { active, supported, toggle };
}
