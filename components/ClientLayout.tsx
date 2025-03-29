'use client'
import Image from 'next/image'
import { useState } from 'react'
import IA from '@/components/ChatAssistent'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <>
      {children}
      <div id="Chatbot">
        <button
          onClick={toggleModal}
          className="fixed right-5 bottom-5 z-40 rounded-full bg-pink-400 p-2 shadow-lg"
        >
          <Image
            src={`/static/images/chat.webp`}
            alt="chatbot"
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>

        <div
          className={`fixed inset-0 z-50 ${isModalOpen ? 'block' : 'hidden'}`}
          onClick={toggleModal}
        >
          <div
            className="fixed right-5 bottom-20 w-94 overflow-hidden rounded-lg bg-slate-900 p-2 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <IA />
            </div>
            <button
              className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
              onClick={toggleModal}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
