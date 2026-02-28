import Link from 'next/link'
import React from 'react'
import UserCard from './UserCard'

export default function PeopleYouMayKnow({users}) {
  return (
    <div>
        <div className="flex justify-between mx-5 font-semibold text-md md:text-lg">
            <p>People You May Know</p>
            <Link href={""} className="text-[#0f81ec]">
              See more
            </Link>
          </div>

          <div className="flex flex-row grow mt-3 overflow-x-scroll hide-scrollbar">
            {users.map((user) => (
              <div key={user.id}>
                <UserCard user={user} />
              </div>
            ))}
          </div>
    </div>
  )
}
