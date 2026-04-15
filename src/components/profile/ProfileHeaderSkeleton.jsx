import { Camera } from "lucide-react";

export default function ProfileHeaderSkeleton() {
    return (
        <div className="w-[95%] md:w-[70%]">
            <section className="h-50 md:h-90 relative rounded-b-3xl object-cover overflow-hidden bg-neutral-200 border border-neutral-300 flex justify-center items-center">
                <p className="font-semibold lg:text-5xl">Upload a cover Image</p>
            </section>

            <section className="h-51 md:h-51 flex flex-row items-start md:items-center pl-3 md:px-17 -mt-5 md:mt-0 relative">
                <div className=" relative">
                    <div className="w-26 md:w-40 h-26 md:h-40 border-3 md:border-0 border-white bg-neutral-300 rounded-full">
                    </div>
                    <div className="w-7 md:w-9 h-7 md:h-9 bg-[#D6D9DD] rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer">
                        <Camera
                            className="text-[#D6D9DD] w-6 md:w-7 h-6 md:h-7"
                            fill="black"
                            strokeWidth="1px"
                        />
                    </div>
                </div>

                <div className="flex flex-col ml-3 md:ml-5 mt-9 md:mt-0 md:gap-1">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                            New User
                        </h2>
                    </div>
                    <div className="text-[12px] md:text-lg font-semibold ml-1 md:ml-0 text-gray-500">
                        <p>User Bio here ...</p>
                    </div>
                </div>
            </section>
        </div>
    );
}