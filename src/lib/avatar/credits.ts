import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type CreditStore = Record<string, number>;

const CREDIT_DIR = path.join(process.cwd(), ".futurebody");
const CREDIT_FILE = path.join(CREDIT_DIR, "avatar-credits.json");

function getDefaultCredits() {
  return Number(process.env.DEFAULT_AVATAR_CREDITS || 8);
}

async function readCreditStore(): Promise<CreditStore> {
  try {
    const raw = await readFile(CREDIT_FILE, "utf8");
    return JSON.parse(raw) as CreditStore;
  } catch {
    return {};
  }
}

async function writeCreditStore(store: CreditStore) {
  await mkdir(CREDIT_DIR, { recursive: true });
  await writeFile(CREDIT_FILE, JSON.stringify(store, null, 2), "utf8");
}

export async function getAvatarCredits(userId: string) {
  const store = await readCreditStore();

  if (typeof store[userId] !== "number") {
    store[userId] = getDefaultCredits();
    await writeCreditStore(store);
  }

  return store[userId];
}

export async function decrementAvatarCredits(userId: string, amount = 1) {
  const store = await readCreditStore();

  const current =
    typeof store[userId] === "number" ? store[userId] : getDefaultCredits();

  if (current < amount) {
    return {
      ok: false,
      credits: current,
    };
  }

  const next = current - amount;
  store[userId] = next;
  await writeCreditStore(store);

  return {
    ok: true,
    credits: next,
  };
}