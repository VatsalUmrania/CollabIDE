// src/hooks/useCursor.ts
export const useCursor = (socket: Socket, editor: monaco.editor.IStandaloneCodeEditor) => {
    const emitCursor = useRef<(pos: monaco.IPosition) => void>()
  
    useEffect(() => {
      // Lazily import to keep bundle small
      import('lodash.throttle').then(({ default: throttle }) => {
        emitCursor.current = throttle((pos) => {
          socket.emit('cursor-update', {
            line: pos.lineNumber,
            col: pos.column,
            tab: activeTab,       // optional: html/css/js
          })
        }, 120, { leading: true, trailing: true })       // ≥100 ms window
      })
    }, [socket])
  
    useEffect(() => {
      const handler = () => {
        const pos = editor.getPosition()
        emitCursor.current?.(pos!)
      }
      editor.onDidChangeCursorPosition(handler)
      editor.onDidBlurEditorWidget(handler)              // send final position
  
      return () => editor.onDidChangeCursorPosition(null as any)
    }, [editor])
  }
  