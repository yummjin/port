import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

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
  rankLabel,
  sortHand,
  suitOf,
  trumpLabel,
  type CardId,
  type GameState,
  type Suit,
  type Trump,
} from "@/lib/mighty";

const ME = 0;
const BOT_DELAY = 550;
const TRICK_PAUSE = 1000;

export default function MightyPage() {
  const [game, setGame] = useState<GameState | null>(null);

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
        <meta
          name="description"
          content="AI 4명과 함께하는 5인 마이티 카드 게임"
        />
      </Head>

      <main className="px-content mx-auto flex max-w-[1000px] flex-col gap-6 pt-12 pb-20">
        <div className="flex flex-col gap-2">
          <Link href="/playground" className="text-caption text-muted w-fit">
            ‹ Playground
          </Link>
          <h1 className="text-section text-[22px]">마이티</h1>
          <p className="text-body-small text-secondary">
            AI 4명과 함께하는 5인 트릭테이킹 카드 게임이에요. 기루다와 공약을
            걸고 주공 팀과 야당 팀으로 나뉘어 점수 카드 20장을 다퉈요.
          </p>
        </div>

        {game ? (
          <Table game={game} setGame={setGame} />
        ) : (
          <div className="border-border flex flex-col items-start gap-4 border p-5">
            <Rules />
            <Button variant="compact" onClick={() => setGame(newRound())}>
              게임 시작
            </Button>
          </div>
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
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
        <InfoBox label="트릭">{Math.min(game.trickNo + 1, 10)} / 10</InfoBox>
      </div>

      <Seats game={game} />

      {game.phase === "bidding" && myTurn && (
        <BidPanel
          game={game}
          onBid={(bid) => setGame((g) => g && applyBid(g, ME, bid))}
        />
      )}

      {game.phase === "exchange" && game.declarer === ME && (
        <ExchangePanel
          game={game}
          onConfirm={(discards, friendCard) =>
            setGame((g) => g && applyExchange(g, discards, friendCard))
          }
        />
      )}

      {game.phase === "result" && game.result && (
        <ResultPanel
          game={game}
          onNext={() =>
            setGame((g) => g && newRound(g.scores, (g.starter + 1) % PLAYERS))
          }
        />
      )}

      {game.phase !== "exchange" || game.declarer !== ME ? (
        <Hand game={game} setGame={setGame} />
      ) : null}

      <Log lines={game.log} status={statusText(game)} />
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
    <div className="border-border text-body-small flex border">
      <span className="border-border text-muted border-r px-3 py-1">
        {label}
      </span>
      <span className="text-foreground px-3 py-1">{children}</span>
    </div>
  );
}

function Seats({ game }: { game: GameState }) {
  const revealAll = game.phase === "result";
  return (
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: PLAYERS }, (_, p) => {
        const play = game.trick.find((t) => t.player === p);
        const isDeclarer = game.declarer === p;
        const isFriend =
          game.friend === p && (game.friendRevealed || revealAll || p === ME);
        const active =
          game.turn === p &&
          game.phase !== "result" &&
          game.phase !== "trickEnd";
        const won = game.phase === "trickEnd" && game.trickWinner === p;
        return (
          <div
            key={p}
            className={cn(
              "border-border flex min-w-0 flex-col items-center gap-2 border px-1 py-3 transition-colors duration-200",
              (active || won) && "border-foreground",
            )}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-body-small text-foreground font-medium">
                {PLAYER_NAMES[p]}
              </span>
              <span className="text-caption text-muted h-4">
                {isDeclarer ? "주공" : isFriend ? "프렌드" : ""}
              </span>
            </div>
            <div className="flex h-16 items-center sm:h-20">
              {play ? (
                <PlayingCard card={play.card} />
              ) : (
                <div className="border-border h-16 w-11 border border-dashed sm:h-20 sm:w-14" />
              )}
            </div>
            <span className="text-caption text-muted text-center">
              점수 {game.taken[p].length} · 패 {game.hands[p].length}
            </span>
            <span className="text-caption text-foreground">
              {game.scores[p] > 0 ? `+${game.scores[p]}` : game.scores[p]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Hand({
  game,
  setGame,
}: {
  game: GameState;
  setGame: (update: (g: GameState | null) => GameState | null) => void;
}) {
  const [pending, setPending] = useState<CardId | null>(null);
  const canPlay = game.phase === "playing" && game.turn === ME;
  const legal = useMemo(
    () => (canPlay ? legalCards(game, ME) : []),
    [canPlay, game],
  );
  const leading = game.trick.length === 0;
  const callCard = jokerCallOf(game.trump);

  const play = (card: CardId, options = {}) => {
    setPending(null);
    setGame((g) => g && applyPlay(g, ME, card, options));
  };

  const onCard = (card: CardId) => {
    if (!legal.includes(card)) return;
    const canCall =
      leading && card === callCard && game.trickNo > 0 && !game.jokerPlayed;
    if (leading && (card === JOKER || canCall)) {
      setPending(card);
      return;
    }
    play(card);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-caption text-muted">내 패</span>
      <div className="flex flex-wrap gap-1.5">
        {game.hands[ME].map((card) => (
          <PlayingCard
            key={card}
            card={card}
            onClick={canPlay ? () => onCard(card) : undefined}
            disabled={canPlay && !legal.includes(card)}
            selected={pending === card}
          />
        ))}
      </div>

      {pending === JOKER && (
        <ChoiceRow label="조커로 요청할 무늬">
          {SUITS.map((suit) => (
            <ChoiceButton
              key={suit}
              onClick={() => play(JOKER, { jokerSuit: suit })}
            >
              {SUIT_SYMBOL[suit]}
            </ChoiceButton>
          ))}
          <ChoiceButton onClick={() => setPending(null)}>취소</ChoiceButton>
        </ChoiceRow>
      )}

      {pending && pending !== JOKER && (
        <ChoiceRow label={`${cardLabel(pending)}로 조커콜 할까요?`}>
          <ChoiceButton onClick={() => play(pending, { jokerCall: true })}>
            조커콜
          </ChoiceButton>
          <ChoiceButton onClick={() => play(pending)}>그냥 내기</ChoiceButton>
          <ChoiceButton onClick={() => setPending(null)}>취소</ChoiceButton>
        </ChoiceRow>
      )}
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
  onConfirm,
}: {
  game: GameState;
  onConfirm: (discards: CardId[], friendCard: CardId | null) => void;
}) {
  const [discards, setDiscards] = useState<CardId[]>([]);
  const options = friendOptions(game);
  const [friendCard, setFriendCard] = useState<CardId | null>(
    options[0] ?? null,
  );
  const hand = sortHand(game.hands[ME], game.trump);

  const toggle = (card: CardId) =>
    setDiscards((current) =>
      current.includes(card)
        ? current.filter((c) => c !== card)
        : current.length < 3
          ? [...current, card]
          : current,
    );

  return (
    <Panel title={`카드 교환 — 버릴 카드 ${discards.length} / 3`}>
      <div className="flex flex-wrap gap-1.5">
        {hand.map((card) => (
          <PlayingCard
            key={card}
            card={card}
            onClick={() => toggle(card)}
            selected={discards.includes(card)}
          />
        ))}
      </div>
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
          onClick={() => onConfirm(discards, friendCard)}
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
      title={`${result.win ? "주공 승리" : "주공 패배"} — 주공 팀 ${result.teamPoints}점 / 공약 ${game.contract}`}
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
    <section className="border-border flex flex-col gap-4 border p-4">
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
        "text-body-small min-w-9 cursor-pointer border px-2.5 py-1 transition-colors duration-150",
        selected
          ? "border-foreground text-foreground"
          : "border-border text-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function PlayingCard({
  card,
  onClick,
  disabled,
  selected,
}: {
  card: CardId;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  const suit = suitOf(card) as Suit | null;
  const red = suit === "D" || suit === "H";
  const content = (
    <>
      <span className="text-caption self-start leading-none font-medium">
        {rankLabel(card)}
      </span>
      <span className="text-body leading-none">
        {suit ? SUIT_SYMBOL[suit] : "★"}
      </span>
    </>
  );
  const className = cn(
    "bg-surface flex h-16 w-11 shrink-0 flex-col items-center justify-between border p-1.5 sm:h-20 sm:w-14",
    red ? "text-[#d70015] dark:text-[#ff6961]" : "text-foreground",
    selected ? "border-foreground -translate-y-1" : "border-border",
    "transition-transform duration-150 motion-reduce:transition-none",
  );

  if (!onClick) {
    return (
      <div className={className} aria-label={cardLabel(card)}>
        {content}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={cardLabel(card)}
      aria-pressed={selected}
      className={cn(
        className,
        "cursor-pointer hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0",
      )}
    >
      {content}
    </button>
  );
}

function Log({ lines, status }: { lines: string[]; status: string }) {
  return (
    <div className="border-border flex flex-col gap-2 border p-4">
      <p className="text-body-small text-foreground" aria-live="polite">
        {status}
      </p>
      <ol className="text-caption text-muted flex flex-col gap-0.5">
        {lines.slice(-8).map((line, i) => (
          <li key={`${lines.length}-${i}`}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

function Rules() {
  return (
    <div className="text-body-small text-secondary flex flex-col gap-1.5">
      <p className="text-foreground font-medium">규칙 요약</p>
      <p>· 53장(조커 포함)을 10장씩 나누고 3장은 바닥에 둬요.</p>
      <p>
        · 13~20 사이로 공약과 기루다(트럼프 무늬)를 걸고, 가장 높은 사람이
        주공이 돼요.
      </p>
      <p>
        · 주공은 바닥 3장을 가져와 3장을 버리고, 카드 한 장으로 프렌드를 불러요.
      </p>
      <p>
        · 10·J·Q·K·A가 점수 카드예요. 주공 팀이 공약 이상을 가져오면 승리해요.
      </p>
      <p>
        · 마이티(♠A, 기루다가 ♠면 ♦A)가 가장 강하고, 조커가 그다음이에요. 조커는
        첫·마지막 트릭에서 힘이 없고, ♣3(기루다가 ♣면 ♠3) 조커콜에 불려 나와요.
      </p>
      <p>· 첫 트릭에는 기루다를 먼저 낼 수 없어요.</p>
    </div>
  );
}
