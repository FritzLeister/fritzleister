export function getTransparentesPaneelGridPosition({ obj, initialX, initialZ, initialY }) {
  return {
    x: obj?.startPos?.x ?? initialX,
    z: obj?.startPos?.z ?? initialZ,
    y: obj?.startPos?.y ?? initialY
  }
}

export function getTransparentesPaneelWorldPosition({
  nextPos,
  lang,
  rechts,
  surfaceOffset,
  xLinks,
  xRechts,
  z
}) {
  const normalSign = rechts ? -1 : 1
  const adjustedX = typeof nextPos?.x === 'number' ? nextPos.x : 0
  const adjustedY = typeof nextPos?.y === 'number' ? nextPos.y : 0
  const adjustedZ = typeof nextPos?.z === 'number' ? nextPos.z : 0

  const finalX = lang
    ? adjustedX
    : (rechts ? xLinks : xRechts) + (!lang ? normalSign * surfaceOffset : 0)
  const finalZ = lang
    ? z + (lang ? normalSign * surfaceOffset : 0)
    : adjustedZ

  return {
    x: finalX,
    y: adjustedY,
    z: finalZ
  }
}
