// 5-player Mighty (마이티) engine + rule-based bots.
// Pure functions only: no React, no imports, so it can be simulated in Node.

export type Suit = "S" | "D" | "H" | "C";
export type Trump = Suit | "N";
export type CardId = string; // "S14" (♠A), "H10", "C3", "JK"
export type Phase = "bidding" | "exchange" | "playing" | "trickEnd" | "result";

export type Bid = { player: number; points: number; trump: Trump };
export type Play = { player: number; card: CardId };
export type PlayOptions = { jokerSuit?: Suit; jokerCall?: boolean };

export type RoundResult = {
  teamPoints: number;
  win: boolean;
  deltas: number[];
};

export type GameState = {
  phase: Phase;
  starter: number;
  hands: CardId[][];
  kitty: CardId[];
  turn: number;
  highestBid: Bid | null;
  passed: boolean[];
  declarer: number | null;
  trump: Trump | null;
  contract: number;
  friendCard: CardId | null;
  friend: number | null;
  friendRevealed: boolean;
  trickNo: number;
  trick: Play[];
  leadSuit: Suit | null;
  jokerCalled: boolean;
  jokerPlayed: boolean;
  trickWinner: number | null;
  taken: CardId[][];
  scores: number[];
  result: RoundResult | null;
  log: string[];
};

export const PLAYERS = 5;
export const MIN_BID = 13;
export const MAX_BID = 20;
export const SUITS: Suit[] = ["S", "D", "H", "C"];
export const JOKER = "JK";
export const PLAYER_NAMES = ["나", "AI 1", "AI 2", "AI 3", "AI 4"];

export const SUIT_SYMBOL: Record<Suit, string> = {
  S: "♠",
  D: "♦",
  H: "♥",
  C: "♣",
};

export function trumpLabel(trump: Trump) {
  return trump === "N" ? "노기루다" : SUIT_SYMBOL[trump];
}

// ---------- cards ----------

export function suitOf(card: CardId): Suit | null {
  return card === JOKER ? null : (card[0] as Suit);
}

export function rankOf(card: CardId): number {
  return card === JOKER ? 0 : Number(card.slice(1));
}

export function rankLabel(card: CardId) {
  if (card === JOKER) return "JK";
  const rank = rankOf(card);
  return { 14: "A", 13: "K", 12: "Q", 11: "J" }[rank] ?? String(rank);
}

export function cardLabel(card: CardId) {
  if (card === JOKER) return "조커";
  return `${SUIT_SYMBOL[suitOf(card)!]}${rankLabel(card)}`;
}

export function isPointCard(card: CardId) {
  return card !== JOKER && rankOf(card) >= 10;
}

export function mightyOf(trump: Trump | null): CardId {
  return trump === "S" ? "D14" : "S14";
}

export function jokerCallOf(trump: Trump | null): CardId {
  return trump === "C" ? "S3" : "C3";
}

function createDeck(): CardId[] {
  const deck: CardId[] = [JOKER];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) deck.push(`${suit}${rank}`);
  }
  return deck;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sortHand(hand: CardId[], trump: Trump | null): CardId[] {
  const order: Suit[] =
    trump && trump !== "N"
      ? [trump, ...SUITS.filter((suit) => suit !== trump)]
      : SUITS;
  const mighty = mightyOf(trump);
  const key = (card: CardId) => {
    if (card === mighty) return -2;
    if (card === JOKER) return -1;
    return order.indexOf(suitOf(card)!) * 100 + (14 - rankOf(card));
  };
  return [...hand].sort((a, b) => key(a) - key(b));
}

// ---------- round flow ----------

export function newRound(
  scores: number[] = Array(PLAYERS).fill(0),
  starter = 0,
  random: () => number = Math.random,
): GameState {
  const deck = shuffle(createDeck(), random);
  const hands = Array.from({ length: PLAYERS }, (_, i) =>
    sortHand(deck.slice(i * 10, i * 10 + 10), null),
  );
  return {
    phase: "bidding",
    starter,
    hands,
    kitty: deck.slice(50),
    turn: starter,
    highestBid: null,
    passed: Array(PLAYERS).fill(false),
    declarer: null,
    trump: null,
    contract: 0,
    friendCard: null,
    friend: null,
    friendRevealed: false,
    trickNo: 0,
    trick: [],
    leadSuit: null,
    jokerCalled: false,
    jokerPlayed: false,
    trickWinner: null,
    taken: Array.from({ length: PLAYERS }, () => []),
    scores,
    result: null,
    log: [`${PLAYER_NAMES[starter]}부터 공약을 시작해요.`],
  };
}

export function minimumBid(highest: Bid | null, trump: Trump) {
  if (!highest) return MIN_BID;
  if (trump === "N" && highest.trump !== "N") return highest.points;
  return highest.points + 1;
}

export function isValidBid(highest: Bid | null, points: number, trump: Trump) {
  return points <= MAX_BID && points >= minimumBid(highest, trump);
}

export function applyBid(
  state: GameState,
  player: number,
  bid: { points: number; trump: Trump } | null,
  random: () => number = Math.random,
): GameState {
  const passed = [...state.passed];
  let highestBid = state.highestBid;
  let log = state.log;

  if (bid && isValidBid(highestBid, bid.points, bid.trump)) {
    highestBid = { player, ...bid };
    log = [
      ...log,
      `${PLAYER_NAMES[player]}: ${trumpLabel(bid.trump)} ${bid.points}`,
    ];
  } else {
    passed[player] = true;
    log = [...log, `${PLAYER_NAMES[player]}: 패스`];
  }

  const candidates = Array.from(
    { length: PLAYERS - 1 },
    (_, i) => (player + 1 + i) % PLAYERS,
  ).filter((p) => !passed[p] && (!highestBid || p !== highestBid.player));

  if (!highestBid && candidates.length === 0) {
    const next = newRound(state.scores, (state.starter + 1) % PLAYERS, random);
    return { ...next, log: ["모두 패스해서 다시 섞어요.", ...next.log] };
  }

  const finished =
    highestBid &&
    (candidates.length === 0 ||
      (highestBid.points === MAX_BID && highestBid.trump === "N"));

  if (finished && highestBid) {
    const declarer = highestBid.player;
    const hands = state.hands.map((hand, i) =>
      i === declarer
        ? sortHand([...hand, ...state.kitty], highestBid.trump)
        : sortHand(hand, highestBid.trump),
    );
    return {
      ...state,
      phase: "exchange",
      hands,
      kitty: [],
      passed,
      highestBid,
      declarer,
      trump: highestBid.trump,
      contract: highestBid.points,
      turn: declarer,
      log: [
        ...log,
        `주공은 ${PLAYER_NAMES[declarer]} — ${trumpLabel(highestBid.trump)} ${highestBid.points}`,
      ],
    };
  }

  return { ...state, passed, highestBid, log, turn: candidates[0] };
}

export function friendOptions(state: GameState): CardId[] {
  const trump = state.trump;
  const mighty = mightyOf(trump);
  const options: CardId[] = [mighty, JOKER];
  if (trump && trump !== "N") {
    for (const rank of [14, 13, 12]) options.push(`${trump}${rank}`);
  }
  for (const suit of SUITS) options.push(`${suit}14`);
  const hand = state.declarer === null ? [] : state.hands[state.declarer];
  return [...new Set(options)].filter((card) => !hand.includes(card));
}

export function applyExchange(
  state: GameState,
  discards: CardId[],
  friendCard: CardId | null,
): GameState {
  const declarer = state.declarer!;
  const hand = state.hands[declarer].filter((card) => !discards.includes(card));
  const hands = state.hands.map((h, i) => (i === declarer ? hand : h));
  const friend =
    friendCard === null
      ? null
      : hands.findIndex((h, i) => i !== declarer && h.includes(friendCard));
  return {
    ...state,
    phase: "playing",
    hands,
    kitty: discards,
    friendCard,
    friend: friend === -1 ? null : friend,
    turn: declarer,
    log: [
      ...state.log,
      friendCard
        ? `프렌드 카드: ${cardLabel(friendCard)}`
        : "프렌드 없이 혼자 플레이해요.",
    ],
  };
}

// ---------- tricks ----------

export function legalCards(state: GameState, player: number): CardId[] {
  const hand = state.hands[player];
  const mighty = mightyOf(state.trump);

  if (state.trick.length === 0) {
    if (state.trickNo === 0 && state.trump && state.trump !== "N") {
      const nonTrump = hand.filter(
        (card) => suitOf(card) !== state.trump || card === mighty,
      );
      if (nonTrump.length > 0) return nonTrump;
    }
    return hand;
  }

  if (state.jokerCalled && hand.includes(JOKER)) {
    return hand.filter((card) => card === JOKER || card === mighty);
  }

  const following = hand.filter((card) => suitOf(card) === state.leadSuit);
  if (following.length === 0) return hand;
  return hand.filter(
    (card) =>
      suitOf(card) === state.leadSuit || card === mighty || card === JOKER,
  );
}

export function winnerOf(
  state: Pick<GameState, "trump" | "trickNo" | "jokerCalled" | "leadSuit">,
  trick: Play[],
): number {
  const mighty = mightyOf(state.trump);
  const mightyPlay = trick.find((play) => play.card === mighty);
  if (mightyPlay) return mightyPlay.player;

  const jokerPlay = trick.find((play) => play.card === JOKER);
  const jokerActive =
    state.trickNo !== 0 && state.trickNo !== 9 && !state.jokerCalled;
  if (jokerPlay && jokerActive) return jokerPlay.player;

  const best = (suit: Suit | null) =>
    trick
      .filter((play) => suit && suitOf(play.card) === suit)
      .sort((a, b) => rankOf(b.card) - rankOf(a.card))[0];

  const trumpWinner =
    state.trump && state.trump !== "N" ? best(state.trump) : undefined;
  return (trumpWinner ?? best(state.leadSuit) ?? trick[0]).player;
}

export function applyPlay(
  state: GameState,
  player: number,
  card: CardId,
  options: PlayOptions = {},
): GameState {
  const hands = state.hands.map((hand, i) =>
    i === player ? hand.filter((c) => c !== card) : hand,
  );
  const leading = state.trick.length === 0;
  const trick = [...state.trick, { player, card }];

  let leadSuit = state.leadSuit;
  let jokerCalled = state.jokerCalled;
  let note = "";
  if (leading) {
    leadSuit = card === JOKER ? (options.jokerSuit ?? "S") : suitOf(card);
    jokerCalled =
      Boolean(options.jokerCall) &&
      card === jokerCallOf(state.trump) &&
      state.trickNo > 0 &&
      !state.jokerPlayed;
    if (card === JOKER) note = ` (${SUIT_SYMBOL[leadSuit!]} 요청)`;
    if (jokerCalled) note = " — 조커콜";
  }

  const revealsFriend = card === state.friendCard && !state.friendRevealed;
  const log = [
    ...state.log,
    `${PLAYER_NAMES[player]}: ${cardLabel(card)}${note}`,
    ...(revealsFriend ? [`${PLAYER_NAMES[player]}이(가) 프렌드예요.`] : []),
  ];

  const next: GameState = {
    ...state,
    hands,
    trick,
    leadSuit,
    jokerCalled,
    jokerPlayed: state.jokerPlayed || card === JOKER,
    friendRevealed: state.friendRevealed || revealsFriend,
    log,
    turn: (player + 1) % PLAYERS,
  };

  if (trick.length < PLAYERS) return next;
  const winner = winnerOf(next, trick);
  return { ...next, phase: "trickEnd", trickWinner: winner, turn: winner };
}

export function collectTrick(state: GameState): GameState {
  const winner = state.trickWinner!;
  const points = state.trick.map((play) => play.card).filter(isPointCard);
  const taken = state.taken.map((cards, i) =>
    i === winner ? [...cards, ...points] : cards,
  );
  const trickNo = state.trickNo + 1;
  const base: GameState = {
    ...state,
    taken,
    trickNo,
    trick: [],
    leadSuit: null,
    jokerCalled: false,
    trickWinner: null,
    turn: winner,
    phase: "playing",
    log: [
      ...state.log,
      `${PLAYER_NAMES[winner]}이(가) 가져가요 (+${points.length})`,
    ],
  };
  return trickNo === 10 ? finishRound(base) : base;
}

function finishRound(state: GameState): GameState {
  const declarer = state.declarer!;
  const friend = state.friend;
  const team = (p: number) => p === declarer || p === friend;
  const teamPoints = state.taken
    .filter((_, i) => team(i))
    .reduce((sum, cards) => sum + cards.length, 0);
  const win = teamPoints >= state.contract;
  const unit = win
    ? teamPoints - MIN_BID + 1 + (state.contract - MIN_BID)
    : state.contract - teamPoints;
  const solo = friend === null;

  const deltas = Array.from({ length: PLAYERS }, (_, p) => {
    const sign = win ? 1 : -1;
    if (p === declarer) return sign * unit * (solo ? 4 : 2);
    if (p === friend) return sign * unit;
    return -sign * unit;
  });

  return {
    ...state,
    phase: "result",
    friendRevealed: true,
    scores: state.scores.map((score, i) => score + deltas[i]),
    result: { teamPoints, win, deltas },
    log: [
      ...state.log,
      `주공 팀 ${teamPoints}점 / 공약 ${state.contract} — ${win ? "주공 승리" : "주공 패배"}`,
    ],
  };
}

// ---------- bots ----------

function handStrength(hand: CardId[], trump: Trump) {
  const mighty = mightyOf(trump);
  const hasMighty = hand.includes(mighty);
  const hasJoker = hand.includes(JOKER);
  const plain = hand.filter((card) => card !== mighty && card !== JOKER);
  const aces = plain.filter((card) => rankOf(card) === 14);

  if (trump === "N") {
    const kings = plain.filter((card) => rankOf(card) === 13).length;
    return (
      4 +
      aces.length * 2 +
      kings * 0.8 +
      (hasMighty ? 3 : 0) +
      (hasJoker ? 2 : 0)
    );
  }

  const trumps = plain.filter((card) => suitOf(card) === trump);
  const honors = trumps.reduce(
    (sum, card) => sum + ({ 14: 1.5, 13: 1, 12: 0.5 }[rankOf(card)] ?? 0),
    0,
  );
  const sideAces = aces.filter((card) => suitOf(card) !== trump).length;
  return (
    6 +
    trumps.length * 1.3 +
    honors +
    sideAces +
    (hasMighty ? 2.5 : 0) +
    (hasJoker ? 2 : 0)
  );
}

export function botBid(
  state: GameState,
  player: number,
): { points: number; trump: Trump } | null {
  const hand = state.hands[player];
  let best: { points: number; trump: Trump; margin: number } | null = null;
  for (const trump of [...SUITS, "N"] as Trump[]) {
    const ceiling = Math.min(MAX_BID, Math.floor(handStrength(hand, trump)));
    const points = minimumBid(state.highestBid, trump);
    const margin = ceiling - points;
    if (margin >= 0 && (!best || margin > best.margin)) {
      best = { points, trump, margin };
    }
  }
  return best ? { points: best.points, trump: best.trump } : null;
}

export function botExchange(state: GameState): {
  discards: CardId[];
  friendCard: CardId | null;
} {
  const hand = state.hands[state.declarer!];
  const trump = state.trump!;
  const mighty = mightyOf(trump);
  const options = friendOptions(state);
  const friendCard =
    [mighty, JOKER, `${trump}14`, `${trump}13`].find((card) =>
      options.includes(card),
    ) ?? null;

  const suitCount = (suit: Suit | null) =>
    hand.filter((card) => suitOf(card) === suit).length;
  const keepValue = (card: CardId) => {
    if (card === mighty || card === JOKER) return 1000;
    if (suitOf(card) === trump) return 500 + rankOf(card);
    return (
      rankOf(card) * 2 + (isPointCard(card) ? 6 : 0) + suitCount(suitOf(card))
    );
  };
  const discards = [...hand]
    .sort((a, b) => keepValue(a) - keepValue(b))
    .slice(0, 3);
  return { discards, friendCard };
}

export function isPartner(
  state: GameState,
  self: number,
  other: number,
): boolean | null {
  if (self === other) return true;
  const declarer = state.declarer!;
  const friend = state.friend;
  const noFriend = state.friendCard === null;

  if (self === declarer) {
    if (noFriend) return false;
    if (state.friendRevealed) return other === friend;
    return null;
  }
  if (self === friend) return other === declarer;
  if (other === declarer) return false;
  if (noFriend) return true;
  if (state.friendRevealed) return other !== friend;
  return null;
}

export function botPlay(
  state: GameState,
  player: number,
): { card: CardId } & PlayOptions {
  const hand = state.hands[player];
  const legal = legalCards(state, player);
  const trump = state.trump!;
  const mighty = mightyOf(trump);
  const isTrump = (card: CardId) => trump !== "N" && suitOf(card) === trump;
  const special = (card: CardId) => card === mighty || card === JOKER;
  const onTeam =
    player === state.declarer ||
    (player === state.friend && state.friend !== null);

  const cost = (card: CardId) =>
    (card === mighty ? 3000 : card === JOKER ? 2000 : 0) +
    (isPointCard(card) ? 100 : 0) +
    (isTrump(card) ? 50 : 0) +
    rankOf(card);
  const cheapest = (cards: CardId[]) =>
    [...cards].sort((a, b) => cost(a) - cost(b))[0];

  if (legal.length === 1) return withJokerSuit(legal[0]);

  // ----- leading -----
  if (state.trick.length === 0) {
    const callCard = jokerCallOf(trump);
    if (
      legal.includes(callCard) &&
      !state.jokerPlayed &&
      !hand.includes(JOKER) &&
      state.trickNo >= 1 &&
      state.trickNo <= 8
    ) {
      return { card: callCard, jokerCall: true };
    }

    if (
      onTeam &&
      legal.includes(JOKER) &&
      state.trickNo >= 1 &&
      state.trickNo <= 8
    ) {
      return withJokerSuit(JOKER);
    }

    const sideAce = legal.find(
      (card) => !special(card) && !isTrump(card) && rankOf(card) === 14,
    );
    if (sideAce) return { card: sideAce };

    const trumps = legal.filter((card) => !special(card) && isTrump(card));
    if (onTeam && state.trickNo >= 1 && trumps.length >= 2) {
      return { card: trumps.sort((a, b) => rankOf(b) - rankOf(a))[0] };
    }

    if (legal.includes(mighty) && state.trickNo >= 7) return { card: mighty };

    const plain = legal.filter((card) => !special(card));
    return withJokerSuit(cheapest(plain.length ? plain : legal));
  }

  // ----- following -----
  const winner = winnerOf(state, state.trick);
  const partner = isPartner(state, player, winner);
  const trickPoints = state.trick.filter((play) =>
    isPointCard(play.card),
  ).length;
  const isLast = state.trick.length === PLAYERS - 1;
  const winningCard = state.trick.find((play) => play.player === winner)!.card;
  const strongWinner =
    special(winningCard) || (isTrump(winningCard) && rankOf(winningCard) >= 13);

  if (partner === true) {
    if (isLast || strongWinner) {
      const gifts = legal.filter(
        (card) => !special(card) && !isTrump(card) && isPointCard(card),
      );
      if (gifts.length) {
        return { card: gifts.sort((a, b) => rankOf(b) - rankOf(a))[0] };
      }
    }
    return { card: cheapest(legal) };
  }

  const winsWith = (card: CardId) =>
    winnerOf(state, [...state.trick, { player, card }]) === player;
  const winning = legal.filter(winsWith).sort((a, b) => cost(a) - cost(b));
  const candidate = winning[0];

  if (candidate && (trickPoints > 0 || isLast)) {
    const worthIt =
      candidate === mighty
        ? trickPoints >= 3 || state.trickNo >= 8
        : candidate === JOKER
          ? trickPoints >= 2
          : true;
    if (worthIt && (trickPoints > 0 || !special(candidate))) {
      return { card: candidate };
    }
  }

  return { card: cheapest(legal) };

  function withJokerSuit(card: CardId): { card: CardId } & PlayOptions {
    if (card !== JOKER || state.trick.length > 0) return { card };
    if (trump !== "N" && onTeam) return { card, jokerSuit: trump };
    const counts = SUITS.map((suit) => ({
      suit,
      count: hand.filter((c) => suitOf(c) === suit).length,
    })).sort((a, b) => b.count - a.count);
    return { card, jokerSuit: counts[0].suit };
  }
}
