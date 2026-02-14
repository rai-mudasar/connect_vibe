import LeftSidebar from '@/components/LeftSideBar'
import React from 'react'
import Feed from '../feed/page'

function page() {
  return (
    <div className="max-w-full h-screen bg-[#F2F4F7] dark:bg-[#333334] overflow-x-hidden">
      <LeftSidebar />
      <Feed />
    </div>
  )
}

export default page