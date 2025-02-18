"use client"

import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Typical from 'react-typical'


interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-green-400 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 ">
          <Typical steps={['Seja bem vindo!', 4000, 'Aproveite sua visita',4000,]} wrapper="span" loop="infinity" />
          </h1>
          
        </div> */}
        <div className="items-start space-y-2 ">
        
          <div className="flex flex-col items-center space-x-2 pt-8">
            {avatar && (
              <Image
                src={avatar}
                alt="avatar"
                width={192}
                height={192}
                className=" h-48 w-48 rounded-full"
              />
            )}
             <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold text-pink-600 tracking-tight">{name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
            <div className="text-gray-500 dark:text-gray-400">{company}</div>
            <div className="flex space-x-3 pt-6">
              <SocialIcon kind="mail" href={`mailto:${email}`} />
              <SocialIcon kind="github" href={github} />
              <SocialIcon kind="linkedin" href={linkedin} />
              <SocialIcon kind="x" href={twitter} />
              <SocialIcon kind="bluesky" href={bluesky} />
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 xl:col-span-2">
            {children}
          </div>
        </div>
        <section>
            <Image src="/static/images/lain.jpg" width={1920} height={1080}
             alt="hero"
            className="items-start pt-5 rounded-lg space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0" />
          </section>
      </div>
    </>
  )
}
