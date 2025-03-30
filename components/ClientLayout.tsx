'use client'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import IA from './ChatAssistent'

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
          className="fixed right-5 bottom-5 z-40 rounded-full bg-blue-400 p-2 shadow-lg"
          aria-label="Open chat assistant"
        >
          <Image
            src={`/static/images/assistent.png`}
            alt="chatbot"
            width={40}
            height={40}
            className="rounded-full"
          />
        </button>

        {/* Always render the IA component but hide it when modal is closed */}
        <div
          className={`fixed inset-0 z-50 ${isModalOpen ? 'block' : 'hidden'}`}
          role="dialog"
          aria-modal={isModalOpen ? 'true' : 'false'}
          aria-hidden={!isModalOpen}
          aria-labelledby="chat-modal-title"
        >
          {/* Backdrop */}
          <button
            className="fixed inset-0 bg-black"
            style={{ opacity: 0.5 }}
            onClick={toggleModal}
            aria-label="Close chat assistant"
          />

          {/* Modal content */}
          <div
            ref={modalRef}
            className="fixed right-5 bottom-20 flex h-[70vh] max-h-[600px] min-h-[400px] w-96 flex-col overflow-hidden rounded-lg bg-slate-900 shadow-xl"
            tabIndex={-1}
          >
            <h2 id="chat-modal-title" className="sr-only">
              Chat with Atena
            </h2>
            <div className="flex-grow overflow-y-auto">
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
      </div>
    </>
  )
}
