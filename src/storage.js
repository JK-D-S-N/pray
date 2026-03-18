import { v4 as uuidv4 } from 'uuid'
import {
  upsertProfile,
  upsertPrayer,
  removeprayer,
  upsertGroup,
  upsertMember,
  insertPrayLog,
} from './sync'

// ── Keys ──────────────────────────────────────────────────────────────────────
const KEYS = {
  user: 'pray:user',
  prayers: 'pray:prayers',
  groups: 'pray:groups',
  members: 'pray:members',
  reminderTime: 'pray:reminder_time',
  prayLog: 'pray:log',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function set(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new StorageEvent('storage', { key }))
}

// ── Hydrate from Supabase ─────────────────────────────────────────────────────
export function hydrateAll({ profile, prayers, groups, members, prayLog }) {
  if (profile) set(KEYS.user, profile)
  set(KEYS.prayers, prayers || [])
  set(KEYS.groups, groups || [])
  set(KEYS.members, members || [])
  set(KEYS.prayLog, prayLog || [])
}

// ── User ──────────────────────────────────────────────────────────────────────
export function getUser() {
  return get(KEYS.user)
}

export function saveUser(id, name) {
  const user = {
    id,
    name: name.trim(),
    avatarInitials: name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
  }
  set(KEYS.user, user)
  upsertProfile(user).catch(console.error)
  return user
}

export function updateUser(updates) {
  const user = getUser()
  if (!user) return null
  const updated = { ...user, ...updates }
  if (updates.name) {
    updated.avatarInitials = updates.name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }
  set(KEYS.user, updated)
  upsertProfile(updated).catch(console.error)
  return updated
}

// ── Prayers ───────────────────────────────────────────────────────────────────
export function getPrayers() {
  return get(KEYS.prayers, [])
}

export function getPrayer(id) {
  return getPrayers().find(p => p.id === id) || null
}

export function addPrayer({ title, body, category, visibility, groupId }) {
  const user = getUser()
  const prayer = {
    id: uuidv4(),
    userId: user?.id ?? '',
    title: title.trim(),
    body: body?.trim() || '',
    category: category || 'other',
    visibility: visibility || 'private',
    groupId: visibility === 'group' ? groupId : undefined,
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  const prayers = getPrayers()
  set(KEYS.prayers, [prayer, ...prayers])
  upsertPrayer(prayer).catch(console.error)
  return prayer
}

export function updatePrayer(id, updates) {
  const prayers = getPrayers()
  const idx = prayers.findIndex(p => p.id === id)
  if (idx === -1) return null
  prayers[idx] = { ...prayers[idx], ...updates }
  set(KEYS.prayers, prayers)
  upsertPrayer(prayers[idx]).catch(console.error)
  return prayers[idx]
}

export function deletePrayer(id) {
  const prayers = getPrayers().filter(p => p.id !== id)
  set(KEYS.prayers, prayers)
  removeprayer(id).catch(console.error)
}

export function markAnswered(id, note) {
  return updatePrayer(id, {
    status: 'answered',
    answeredNote: note?.trim() || '',
    answeredAt: new Date().toISOString(),
  })
}

// ── Groups ────────────────────────────────────────────────────────────────────
export function getGroups() {
  return get(KEYS.groups, [])
}

export function getGroup(id) {
  return getGroups().find(g => g.id === id) || null
}

function generateInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function createGroup(name) {
  const user = getUser()
  const group = {
    id: uuidv4(),
    name: name.trim(),
    createdBy: user?.id ?? '',
    inviteCode: generateInviteCode(),
    createdAt: new Date().toISOString(),
  }
  const groups = getGroups()
  set(KEYS.groups, [group, ...groups])
  upsertGroup(group).catch(console.error)
  addMember(group.id, user?.id, 'admin')
  return group
}

export function findGroupByCode(code) {
  return getGroups().find(g => g.inviteCode === code.toUpperCase().trim()) || null
}

export function saveGroupLocally(group) {
  const groups = getGroups()
  if (!groups.find(g => g.id === group.id)) {
    set(KEYS.groups, [group, ...groups])
  }
}

// ── Members ───────────────────────────────────────────────────────────────────
export function getMembers() {
  return get(KEYS.members, [])
}

export function addMember(groupId, userId, role = 'member') {
  const members = getMembers()
  const already = members.find(m => m.groupId === groupId && m.userId === userId)
  if (already) return already
  const member = { groupId, userId, role, joinedAt: new Date().toISOString() }
  set(KEYS.members, [...members, member])
  upsertMember(member).catch(console.error)
  return member
}

export function getUserGroups() {
  const user = getUser()
  if (!user) return []
  const members = getMembers().filter(m => m.userId === user.id)
  const groups = getGroups()
  return members.map(m => groups.find(g => g.id === m.groupId)).filter(Boolean)
}

export function isInGroup(groupId) {
  const user = getUser()
  if (!user) return false
  return getMembers().some(m => m.groupId === groupId && m.userId === user.id)
}

// ── Reminders ─────────────────────────────────────────────────────────────────
export function getReminderTime() {
  return get(KEYS.reminderTime)
}

export function setReminderTime(time) {
  if (time) {
    set(KEYS.reminderTime, time)
  } else {
    localStorage.removeItem(KEYS.reminderTime)
    window.dispatchEvent(new StorageEvent('storage', { key: KEYS.reminderTime }))
  }
}

// ── Pray log ──────────────────────────────────────────────────────────────────
export function getPrayLog() {
  return get(KEYS.prayLog, [])
}

export function logPrayed(prayerId) {
  const user = getUser()
  const entry = { prayerId, prayedAt: new Date().toISOString() }
  set(KEYS.prayLog, [entry, ...getPrayLog()])
  insertPrayLog(entry, user?.id).catch(console.error)
  return entry
}

export function getPrayedCount(prayerId) {
  return getPrayLog().filter(e => e.prayerId === prayerId).length
}

export function getLastPrayed(prayerId) {
  const entry = getPrayLog().find(e => e.prayerId === prayerId)
  return entry?.prayedAt ?? null
}

// ── Categories ────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = ['faith', 'family', 'health', 'work', 'other']

export function getCategories() {
  const custom = get('pray:categories', [])
  return [...DEFAULT_CATEGORIES, ...custom.filter(c => !DEFAULT_CATEGORIES.includes(c))]
}

export function addCategory(name) {
  const trimmed = name.trim().toLowerCase()
  if (!trimmed) return
  const custom = get('pray:categories', [])
  if (getCategories().includes(trimmed)) return
  set('pray:categories', [...custom, trimmed])
}

export function deleteCategory(name) {
  if (DEFAULT_CATEGORIES.includes(name)) return
  const custom = get('pray:categories', [])
  set('pray:categories', custom.filter(c => c !== name))
}

// ── Export ────────────────────────────────────────────────────────────────────
export function exportData() {
  return {
    user: getUser(),
    prayers: getPrayers(),
    groups: getGroups(),
    members: getMembers(),
    prayLog: getPrayLog(),
    exportedAt: new Date().toISOString(),
  }
}
