function placeholder(username) {
  const placeLetters = username
    .split(" ")
    .map((word) => {
      return word[0].toUpperCase()
    })
    .join("")

  return placeLetters
}

function clipText(username) {
  return username.slice(0, 6)
}

export { placeholder, clipText }
