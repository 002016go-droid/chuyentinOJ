import bcrypt from 'bcryptjs'

const SESSION_KEY = 'chuyentin:session'
const PASSWORD_HASH_KEY = 'chuyentin:passwordHash'
const USERNAME_KEY = 'chuyentin:username'

export const DEFAULT_PASSWORD = 'chuyentin2025'
export const DEFAULT_USERNAME = 'Lập trình viên ChuyenTin'

function initIfNeeded() {
  if (!localStorage.getItem(PASSWORD_HASH_KEY)) {
    const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 8)
    localStorage.setItem(PASSWORD_HASH_KEY, hash)
  }
  if (!localStorage.getItem(USERNAME_KEY)) {
    localStorage.setItem(USERNAME_KEY, DEFAULT_USERNAME)
  }
}

export function isLoggedIn(): boolean {
  initIfNeeded()
  return !!localStorage.getItem(SESSION_KEY)
}

export function login(password: string): boolean {
  initIfNeeded()
  const hash = localStorage.getItem(PASSWORD_HASH_KEY) ?? ''
  if (!bcrypt.compareSync(password, hash)) return false
  const session = bcrypt.hashSync(`${password}:${Date.now()}`, 6)
  localStorage.setItem(SESSION_KEY, session)
  return true
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function getUsername(): string {
  initIfNeeded()
  return localStorage.getItem(USERNAME_KEY) ?? DEFAULT_USERNAME
}

export function setUsername(name: string): void {
  localStorage.setItem(USERNAME_KEY, name)
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  initIfNeeded()
  const hash = localStorage.getItem(PASSWORD_HASH_KEY) ?? ''
  if (!bcrypt.compareSync(oldPassword, hash)) return false
  const newHash = bcrypt.hashSync(newPassword, 8)
  localStorage.setItem(PASSWORD_HASH_KEY, newHash)
  return true
}

export function verifyPassword(password: string): boolean {
  initIfNeeded()
  const hash = localStorage.getItem(PASSWORD_HASH_KEY) ?? ''
  return bcrypt.compareSync(password, hash)
}
