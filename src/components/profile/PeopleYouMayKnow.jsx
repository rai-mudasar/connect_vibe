'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import UserCard from './UserCard'
import { toast } from 'sonner';
import { getNearbyPeople, handleSentFriendRequest } from '@/actions/friendActions';

export default function PeopleYouMayKnow() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const res = await getNearbyPeople();
    if (res?.success) {
      setUsers(res.data)
      return
    }
  }

  const handleOnAction = async (id, type) => {
    let res;
    if (type === "nearby") res = await handleSentFriendRequest(id);

    if (res.success) {
      toast.success(res.message)
      fetchData();
    } else {
      toast.error(`Error : ${res.message}`)
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

          <div className="flex flex-row grow gap-5 mx-5 mt-3 overflow-x-scroll hide-scrollbar">
            {users.map((user) => (
              <UserCard key={user._id} user={user} type={"nearby"} onAction={handleOnAction} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
