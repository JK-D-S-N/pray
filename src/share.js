/**
 * Share text via the Web Share API if available,
 * otherwise fall back to a wa.me deep link.
 */
export function shareText(text) {
  if (navigator.share) {
    return navigator.share({ text }).catch(() => {
      // user cancelled — not an error
    })
  }
  const encoded = encodeURIComponent(text)
  window.open(`https://wa.me/?text=${encoded}`, '_blank', 'noopener')
}

export function groupInviteText(groupName, inviteCode) {
  return `Hey! Join my prayer group "${groupName}" on sounding.\n\nInvite code: ${inviteCode}`
}

export function answeredPrayerText(title, note) {
  const base = `🙏 A prayer was answered!\n\n"${title}"`
  return note ? `${base}\n\n${note}` : base
}
