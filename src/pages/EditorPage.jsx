import { useState, useRef, useEffect } from "react"
import { useLocation, useParams, useNavigate, Navigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import User from "../components/User.jsx"
import Editor from "../components/Editor.jsx"
import { initSocket } from "../socket/socket.js"
import ACTIONS from "../socket/action.js"

const EditorPage = () => {
  const [clients, setClients] = useState([])

  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()

  const socketRef = useRef(null)
  const codeRef = useRef(null)

  const handleErrors = (err) => {
    console.log("Socket error", err)
    toast.error("Socket connection failed, try again later.")
    navigate("/")
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(params.roomId)
      toast.success("Room Id has been copied!")
    } catch (err) {
      toast.error("Could not copy the Room Id")
      console.error(err)
    }
  }

  const leaveRoom = async () => {
    navigate("/")
  }

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket()

      socketRef.current.once(ACTIONS.CONNECT_ERROR, (err) => handleErrors(err))
      socketRef.current.once(ACTIONS.CONNECT_FAILED, (err) => handleErrors(err))

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId: params.roomId,
        username: location.state?.username,
      })

      // Listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`)
            console.log(`${username} joined`)
          }

          setClients(clients)

          // Sync code on joining
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          })
        }
      )

      // Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`)
        setClients((prevClients) => {
          return prevClients.filter(
            (prevClient) => prevClient.socketId !== socketId
          )
        })
      })
    }

    init()

    return () => {
      socketRef.current.disconnect(true)
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
    }
  }, [])

  if (!location.state) {
    return <Navigate to="/" />
  }

  return (
    <div className="flex w-full h-screen">
      {/* *****************  aside  ********************* */}
      <div className="relative flex flex-col w-56 bg-gray-800 p-4">
        <img
          className="w-36 self-start"
          src="/code-sync.png"
          alt="code-sync-logo"
        />

        <div className="divider"></div>

        <h4 className="text-xl">Connected</h4>

        {/* Clients */}
        {/* <div className="flex flex-wrap content-start mt-4 h-[70%] overflow-auto mb-2">
          {clients.map((client) => (
            <User key={client.socketId} username={client.username} />
          ))}
        </div> */}
        <div className="grid grid-cols-2 gap-4 content-start  mt-4 h-[70%] overflow-auto mb-2">
          {clients.map((client) => (
            <User key={client.socketId} username={client.username} />
          ))}
        </div>

        {/* Buttons */}
        <div className="bottom-0 flex flex-col space-y-4 mb-2">
          <button onClick={copyRoomId} className="btn">
            Copy ROOM ID
          </button>
          <button onClick={leaveRoom} className="btn">
            Leave
          </button>
        </div>
      </div>

      {/* *********************** Editor ***************************** */}
      <Editor
        socketRef={socketRef}
        roomId={params.roomId}
        onCodeChange={(code) => (codeRef.current = code)}
      />
    </div>
  )
}

export default EditorPage
