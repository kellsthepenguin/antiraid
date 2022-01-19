export default function generateRandomShortId () {
  return Math.random().toString(36).substring(2, 5)
}
