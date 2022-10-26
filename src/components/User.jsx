import React from "react"
import { placeholder, clipText } from "../utils/text.js"

const User = ({ username }) => {
  return (
    <div className="flex flex-col items-center" title={username}>
      <div className="avatar placeholder">
        <div className="bg-pink-700 text-white w-12 rounded-xl">
          <span className="text-xl">{placeholder(username)}</span>
        </div>
      </div>
      <p>{clipText(username)}</p>
    </div>
  )
}

export default User
