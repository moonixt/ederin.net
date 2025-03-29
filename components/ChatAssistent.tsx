'use client' // Indica que este código é executado no cliente

import React, { useState } from 'react' // Importa React e o hook useState
import { ScrollArea } from '@radix-ui/react-scroll-area' // Importa componente de área de rolagem
import { Avatar, AvatarImage } from '@radix-ui/react-avatar' // Importa componentes de avatar
import { TypeAnimation } from 'react-type-animation' // Importa componente de animação de texto

const Ia = () => {
  // Estado para armazenar o valor do input
  const [inputValue, setInputValue] = useState('')
  // Estado para armazenar o resultado do chat
  const [chatResult, setChatResult] = useState('')
  // Estado para controlar o estado de carregamento
  const [isLoading, setIsLoading] = useState(false)
  // Estado para armazenar resultados anteriores do chat
  const [prevResult, setPrevResult] = useState<string[]>([])
  // Estado para armazenar a resposta da API
  // const [apiData, setApiData] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setChatResult('')

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
      let accumulatedText = '' // Texto acumulado da resposta
      let partialLine = '' // Linha parcial para processamento

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          // Acumula o chunk no buffer de linha parcial
          partialLine += chunk

          const lines = partialLine.split('\n')

          // A última linha pode estar incompleta
          partialLine = lines.pop() || ''

          // Processa cada linha completa
          for (const line of lines) {
            if (line.trim() === '') continue // Ignora linhas vazias

            try {
              const event = JSON.parse(line)

              // Verifica se é um evento de token
              if (event.event === 'token' && event.data && event.data.chunk !== undefined) {
                // Acumula o texto do token
                accumulatedText += event.data.chunk

                // Atualiza a UI em tempo real com o texto acumulado
                setChatResult(accumulatedText)
              }
            } catch (e) {
              console.error('Erro ao processar linha JSON:', line, e)
            }
          }
        }

        // Quando terminar a leitura completa do stream, adiciona ao histórico
        if (accumulatedText) {
          setPrevResult((prev) => [...prev, accumulatedText])
        }
      } catch (error) {
        console.error('Erro ao processar stream:', error)
      }
    } catch (error) {
      console.error('Erro ao processar stream:', error)
    }

    setInputValue('') // Limpa o input
    setIsLoading(false)
  }

  return (
    <div className="flex h-150 flex-col">
      <div className="flex h-full w-full flex-col bg-black text-white">
        <div className="pt-2">
          <div className="flex justify-center text-xl font-bold text-white">
            <h1>ATENA</h1>
          </div>
        </div>
        <div className="mt-1 flex-1 overflow-hidden">
          <ScrollArea className="h-120 overflow-y-auto">
            <section>
              <Avatar className="items-top flex gap-2 p-2">
                <AvatarImage
                  className="h-10 w-10 rounded-full border-2 border-red-300 object-cover"
                  src="https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/VqCmNMo_PnKgGaAzKRJKT.png"
                ></AvatarImage>
                {/* Componente TypeAnimation para exibir texto animado */}
                <TypeAnimation
                  className="text-sm"
                  sequence={[
                    'Olá',
                    1000,
                    'Olá! Eu sou a Atena!',
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
              </Avatar>
              <Avatar>
                <section className="flex flex-col gap-2 px-2 pt-2 text-white">
                  {prevResult.length > 1 &&
                    prevResult.map(
                      (result, index) =>
                        result &&
                        (index !== prevResult.length - 1 || result !== chatResult) && (
                          <div key={index} className="flex items-center gap-1">
                            <AvatarImage
                              className="h-10 w-10 rounded-full border-2 border-slate-300"
                              src="https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/VqCmNMo_PnKgGaAzKRJKT.png"
                            />
                            <p className="text-xs text-slate-400">{result}</p>
                          </div>
                        )
                    )}
                  {chatResult && (
                    <div className="flex items-center gap-1">
                      <AvatarImage
                        className="h-10 w-10 rounded-full border-2 border-blue-300"
                        src="https://cdn-avatars.huggingface.co/v1/production/uploads/no-auth/VqCmNMo_PnKgGaAzKRJKT.png"
                      />
                      <p className="">{chatResult}</p>
                    </div>
                  )}
                </section>
              </Avatar>
            </section>
          </ScrollArea>
        </div>
        <div className="w-full p-2">
          <form onSubmit={handleSubmit} className="flex gap-1">
            <input
              type="text"
              className="h-8 w-full rounded-lg border border-gray-300 p-1 text-xs text-black"
              placeholder="Digite uma mensagem"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="rounded-lg bg-gray-700 px-2 text-xs"
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

export default Ia // Exporta o componente Main como padrão
