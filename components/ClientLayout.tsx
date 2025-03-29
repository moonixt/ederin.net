'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import IA from '@/components/ChatAssistent'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  // Close modal with escape key
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        toggleModal()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isModalOpen])

  // Focus trap in modal
  useEffect(() => {
    if (isModalOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isModalOpen])

  return (
    <>
      {children}
      <div id="Chatbot">
        <button
          onClick={toggleModal}
          className="fixed right-5 bottom-5 z-40 rounded-full bg-pink-400 p-2 shadow-lg"
          aria-label="Open chat assistant"
        >
          <Image
            src={`/static/images/chat.webp`}
            alt="chatbot"
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-modal-title"
          >
            {/* Backdrop - convert to button for accessibility */}
            <button
              className="bg-opacity-50 fixed inset-0"
              onClick={toggleModal}
              aria-label="Close chat assistant"
            />

            {/* Modal content */}
            <div
              ref={modalRef}
              className="fixed right-5 bottom-20 w-94 overflow-hidden rounded-lg bg-slate-900 p-2 shadow-lg"
              tabIndex={-1}
            >
              <h2 id="chat-modal-title" className="sr-only">
                Chat with Atena
              </h2>
              <div>
                <IA />
              </div>
              <button
                className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white"
                onClick={toggleModal}
                aria-label="Close chat assistant"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
