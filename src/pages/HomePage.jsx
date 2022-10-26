import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { v4 as uuidv4 } from "uuid"

const HomePage = () => {
  const [roomId, setRoomId] = useState("")
  const [username, setusername] = useState("")
  const navigate = useNavigate()

  const createNewRoom = (e) => {
    e.preventDefault()
    const id = uuidv4()
    setRoomId(id)
    toast.success("Room Created!")
  }

  const joinRoom = (e) => {
    e.preventDefault()
    if (!roomId || !username) {
      toast.error("Room id & User name is required")
      return
    }

    // Redirect to editor page
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    })
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        {/* Card */}
        <div className="card w-96 bg-neutral text-neutral-content shadow-xl items-center py-8">
          <img
            className="w-48 self-start ml-8 mb-6"
            src="/code-sync.png"
            alt="code-sync-logo"
          />
          {/* form */}
          <form className="w-full mb-6 flex justify-center">
            <div className="form-control w-full max-w-xs space-y-6">
              <label className="label">
                <span className="label-text font-semibold -mb-2">
                  Paste invitation ROOM ID
                </span>
              </label>
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                type="text"
                placeholder="ROOM ID"
                className="input input-bordered w-full"
              />
              <input
                value={username}
                onChange={(e) => setusername(e.target.value)}
                type="text"
                placeholder="USERNAME"
                className="input input-bordered w-full"
              />
              <button
                onClick={joinRoom}
                className="btn btn-primary w-1/3 ml-auto"
              >
                Join
              </button>
            </div>
          </form>

          {/* New Room Generator */}
          <p>
            If you don't have an invite then create{" "}
            <button
              onClick={createNewRoom}
              href="#"
              className="link link-primary"
            >
              new room
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

export default HomePage
