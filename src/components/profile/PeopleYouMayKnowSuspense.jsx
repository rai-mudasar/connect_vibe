
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'


export default function PeopleYouMayKnowSuspense() {
    return (
        <div>
            <div className="flex justify-between mx-5 font-semibold text-md md:text-lg">
                <p>People You May Know</p>
                <Link href={"/friends"} className="text-[#0f81ec]">
                    See more
                </Link>
            </div>

            <div className="w-[88vw] md:[69vw] flex flex-row gap-5 mt-3 px-3 pb-8 overflow-x-scroll hide-scrollbar relative">
                <div className='h-full w-full flex justify-center items-center absolute -mt-8 md:-mx-37'> <Loader2 className="h-14 w-14 text-[#0f81ec] animate-spin" /></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
                <div className="w-32 md:w-40 h-49 md:h-65 shrink-0 shadow-xl rounded-lg overflow-hidden bg-gray-200"></div>
            </div>
        </div>
    )
}
