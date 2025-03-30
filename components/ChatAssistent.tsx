'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { TypeAnimation } from 'react-type-animation'

const Ia = () => {
  const [inputValue, setInputValue] = useState('')
  const [chatResult, setChatResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [prevResult, setPrevResult] = useState<string[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatResult, prevResult])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!inputValue.trim()) return

    setIsLoading(true)
    setChatResult('')

    // Store user message
    const userMessage = inputValue
    setPrevResult((prev) => [...prev, `USER: ${userMessage}`])

    try {
      // Call your Next.js API route instead of the external endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_value: inputValue,
          output_type: 'chat',
          input_type: 'chat',
          tweaks: {
            'ChatInput-C95xY': {
              sender: 'User',
              sender_name: 'User',
              should_store_message: true,
            },
            'ChatOutput-sG4tO': {
              clean_data: true,
              data_template: '{text}',
              should_store_message: true,
            },
            'GroqModel-l81mn': {
              api_key: '', // API key handled on server
              base_url: 'https://api.groq.com',
              model_name: 'gemma2-9b-it',
              temperature: 0.1,
              stream: true,
            },
          },
        }),
      })
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Erro: A resposta não contém um corpo legível (ReadableStream)')
      }

      const decoder = new TextDecoder()
      let accumulatedText = ''
      let partialLine = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          partialLine += chunk
          const lines = partialLine.split('\n')
          partialLine = lines.pop() || ''

          for (const line of lines) {
            if (line.trim() === '') continue

            try {
              const event = JSON.parse(line)
              if (event.event === 'token' && event.data && event.data.chunk !== undefined) {
                accumulatedText += event.data.chunk
                setChatResult(accumulatedText)
              }
            } catch (e) {
              console.error('Erro ao processar linha JSON:', line, e)
            }
          }
        }

        if (accumulatedText) {
          setPrevResult((prev) => [...prev, `ATENA: ${accumulatedText}`])
          setChatResult('') // Clear the streaming result once it's added to history
        }
      } catch (error) {
        console.error('Erro ao processar stream:', error)
      }
    } catch (error) {
      console.error('Erro ao processar stream:', error)
    }

    setInputValue('')
    setIsLoading(false)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-full w-full flex-col bg-black text-white">
        {/* Header */}
        <div className="border-b border-gray-800 pt-2 pb-2">
          <div className="flex justify-center text-xl font-bold text-white">
            <h1>Maxine</h1>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden">
          <div ref={scrollAreaRef} className="h-full overflow-y-auto px-2 py-2">
            <section className="space-y-4 space-x-4">
              {/* Welcome message */}
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage
                      className="h-15 w-15 rounded-full border-2 border-red-300 object-cover"
                      src="/static/images/assistent.png"
                    />
                  </Avatar>
                </div>
                <div className="max-w-[85%] rounded-lg bg-gray-950 p-2">
                  <TypeAnimation
                    className="text-sm"
                    sequence={[
                      'Olá',
                      1000,
                      'Olá! Eu sou a Maxine!',
                      1000,
                      'Como posso te ajudar?',
                      1000,
                      'Digite uma mensagem para começarmos!',
                      1000,
                      'Pode ser qualquer coisa!😊',
                      1000,
                    ]}
                    speed={50}
                    repeat={Infinity}
                  />
                </div>
              </div>

              {/* Chat history */}
              {prevResult.map((result, index) => {
                const isUser = result.startsWith('USER:')
                const messageContent = isUser
                  ? result.substring(5).trim()
                  : result.substring(6).trim()

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2 ${isUser ? 'justify-end' : ''}`}
                  >
                    {!isUser && (
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage
                            className="h-15 w-15 rounded-full border-2 border-slate-300"
                            src="/static/images/assistent.png"
                          />
                        </Avatar>
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-lg p-2 text-sm ${
                        isUser ? 'bg-blue-600 text-white' : 'bg-gray-950 text-slate-200'
                      }`}
                    >
                      {messageContent}
                    </div>
                    {isUser && (
                      <div className="flex-shrink-0">
                        <div className="flex h-8 w-15 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                          U
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Current message being typed - only show when not in history yet */}
              {chatResult && (
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    <Avatar>
                      <AvatarImage
                        className="ro15nded-full h-8 w-15 border-2 border-blue-300"
                        src="/static/images/assistent.png"
                      />
                    </Avatar>
                  </div>
                  <div className="max-w-[85%] rounded-lg bg-gray-800 p-2 text-sm">{chatResult}</div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Input area */}
        <div className="w-full border-t border-gray-800 p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              className="h-10 w-full rounded-lg border border-gray-600 bg-gray-800 p-2 text-sm text-white"
              placeholder="Digite uma mensagem"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? '...' : '→'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Ia
