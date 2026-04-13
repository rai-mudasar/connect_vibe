'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import UserCard from './UserCard'
import { toast } from 'sonner';
import { handleSentFriendRequest } from '@/actions/friendActions';
import { useRouter } from 'next/navigation';

export default function PeopleYouMayKnow({ knowUsers }) {
  const [users, setUsers] = useState(knowUsers)

  const router = useRouter()

  const handleOnAction = async (id, type) => {
    const oldUsers = [...users];
    setUsers(users.filter( user => user._id !== id))
    
    if (type === "nearby") {
      const res = await handleSentFriendRequest(id);

      if (res.success) {
        toast.success(res.message)
        router.refresh()
      } else {
        setUsers(oldUsers)
        toast.error(`Error : ${res.message}`)
      }
    }
  }
  return (
    <div>
      {users.length !== 0 && (
        <div>
          <div className="flex justify-between mx-5 font-semibold text-md md:text-lg">
            <p>People You May Know</p>
            <Link href={"/friends"} className="text-[#0f81ec]">
              See more
            </Link>
          </div>

          <div className="w-[88vw] md:w-[69vw] flex flex-row gap-5 mt-3 px-3 pb-8 overflow-x-scroll hide-scrollbar">
            {users.map((user) => (
              <UserCard key={user._id} user={user} type={"nearby"} onAction={handleOnAction} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
