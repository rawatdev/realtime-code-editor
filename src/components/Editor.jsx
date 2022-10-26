import { useState, useCallback, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { langs } from "@uiw/codemirror-extensions-langs"
import ACTIONS from "../socket/action"

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [codeValue, setCodeValue] = useState("")

  const onChange = useCallback(
    (value, viewUpdate) => {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
      })

      onCodeChange(value)
    },
    [roomId, socketRef]
  )

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          setCodeValue(code)
        }
      })
    }

    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
  }, [socketRef, socketRef.current])

  return (
    <CodeMirror
      value={codeValue}
      onChange={onChange}
      theme={dracula}
      extensions={[javascript({ jsx: true }), langs.jsx()]}
      height="100%"
      className="w-full text-xl"
    />
  )
}

export default Editor
