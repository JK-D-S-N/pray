import { supabase } from './supabase'

// ── Data mappers ───────────────────────────────────────────────────────────────

function prayerToRow(p) {
  return {
    id: p.id,
    user_id: p.userId,
    title: p.title,
    body: p.body || '',
    category: p.category || 'other',
    visibility: p.visibility || 'private',
    group_id: p.groupId || null,
    status: p.status || 'active',
    answered_note: p.answeredNote || '',
    answered_at: p.answeredAt || null,
    created_at: p.createdAt,
  }
}

function rowToPrayer(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    category: row.category,
    visibility: row.visibility,
    groupId: row.group_id,
    status: row.status,
    answeredNote: row.answered_note,
    answeredAt: row.answered_at,
    createdAt: row.created_at,
  }
}

function groupToRow(g) {
  return {
    id: g.id,
    name: g.name,
    created_by: g.createdBy,
    invite_code: g.inviteCode,
    created_at: g.createdAt,
  }
}

function rowToGroup(row) {
  return {
    id: row.id,
    name: row.name,
    createdBy: row.created_by,
    inviteCode: row.invite_code,
    createdAt: row.created_at,
  }
}

function memberToRow(m) {
  return {
    group_id: m.groupId,
    user_id: m.userId,
    role: m.role,
    joined_at: m.joinedAt,
  }
}

function rowToMember(row) {
  return {
    groupId: row.group_id,
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
  }
}

function rowToPrayLog(row) {
  return {
    prayerId: row.prayer_id,
    prayedAt: row.prayed_at,
  }
}

// ── Supabase writes ────────────────────────────────────────────────────────────

export async function upsertProfile({ id, name, avatarInitials }) {
  return supabase.from('profiles').upsert({ id, name, avatar_initials: avatarInitials })
}

export async function upsertPrayer(prayer) {
  return supabase.from('prayers').upsert(prayerToRow(prayer))
}

export async function removeprayer(id) {
  return supabase.from('prayers').delete().eq('id', id)
}

export async function upsertGroup(group) {
  return supabase.from('groups').upsert(groupToRow(group))
}

export async function upsertMember(member) {
  return supabase.from('group_members').upsert(memberToRow(member))
}

export async function insertPrayLog(entry, userId) {
  return supabase.from('pray_log').insert({
    prayer_id: entry.prayerId,
    user_id: userId,
    prayed_at: entry.prayedAt,
  })
}

// ── Supabase reads ─────────────────────────────────────────────────────────────

export async function findGroupByCodeRemote(code) {
  const { data } = await supabase
    .from('groups')
    .select('*')
    .eq('invite_code', code.toUpperCase().trim())
    .single()
  return data ? rowToGroup(data) : null
}

export async function fetchAllUserData(userId) {
  const [
    { data: profile },
    { data: ownPrayers },
    { data: myMemberships },
    { data: prayLog },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('prayers').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('group_members').select('*').eq('user_id', userId),
    supabase.from('pray_log').select('*').eq('user_id', userId).order('prayed_at', { ascending: false }),
  ])

  const groupIds = (myMemberships || []).map(m => m.group_id)

  let groups = []
  let allMembers = []
  let groupPrayers = []

  if (groupIds.length > 0) {
    const [{ data: groupData }, { data: memberData }, { data: gpData }] = await Promise.all([
      supabase.from('groups').select('*').in('id', groupIds),
      supabase.from('group_members').select('*').in('group_id', groupIds),
      supabase.from('prayers').select('*').eq('visibility', 'group').in('group_id', groupIds),
    ])
    groups = groupData || []
    allMembers = memberData || []
    groupPrayers = (gpData || []).filter(p => p.user_id !== userId)
  }

  const allPrayers = [
    ...(ownPrayers || []),
    ...groupPrayers,
  ]

  return {
    profile: profile ? {
      id: profile.id,
      name: profile.name,
      avatarInitials: profile.avatar_initials,
    } : null,
    prayers: allPrayers.map(rowToPrayer),
    groups: groups.map(rowToGroup),
    members: allMembers.map(rowToMember),
    prayLog: (prayLog || []).map(rowToPrayLog),
  }
}
