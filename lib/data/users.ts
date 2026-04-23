import fs from "fs";
import path from "path";
import type { UserWithPassword, User } from "@/types";

let _usersCache: UserWithPassword[] | null = null;

function loadUsers(): UserWithPassword[] {
  if (_usersCache) return _usersCache;
  const filePath = path.join(process.cwd(), "data", "users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  _usersCache = JSON.parse(raw) as UserWithPassword[];
  return _usersCache;
}

export function getAllUsers(): UserWithPassword[] {
  return loadUsers();
}

export function findUserByCredentials(
  username: string,
  password: string
): User | null {
  const users = loadUsers();
  const match = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!match) return null;
  // Strip password before returning
  const { password: _pw, ...safeUser } = match;
  void _pw;
  return safeUser;
}

export function findUserById(userId: string): User | null {
  const users = loadUsers();
  const match = users.find((u) => u.id === userId);
  if (!match) return null;
  const { password: _pw, ...safeUser } = match;
  void _pw;
  return safeUser;
}
