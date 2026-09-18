import { Camera } from "lucide-react";

export default function ProfileHeaderSkeleton() {
    return (
        <div className="w-[95%] md:w-[70%]">
            <section className="h-50 md:h-90 relative rounded-b-3xl object-cover overflow-hidden bg-bg-gray2 dark:bg-dark-card border border-border dark:border-border-dark flex justify-center items-center">
                <p className="font-semibold lg:text-5xl text-text1 dark:text-text-dark
                ">Upload a cover Image</p>
            </section>

            <section className="h-51 md:h-51 flex flex-row items-start md:items-center pl-3 md:px-17 -mt-5 md:mt-0 relative">
                <div className=" relative">
                    <div className="w-26 md:w-40 h-26 md:h-40 rounded-full bg-bg-gray1 dark:bg-dark-card border-2 border-border dark:border-dark">
                    </div>
                    <div className="w-7 md:w-9 h-7 md:h-9 bg-bg-gray1 rounded-full absolute bottom-4 right-0 flex justify-center items-center cursor-pointer">
                    </div>
                </div>

                <div className="flex flex-col ml-3 md:ml-5 mt-9 md:mt-0 md:gap-1">
                    <div>
                        <h2 className="text-xl text-primary md:text-2xl font-bold">
                            New User
                        </h2>
                    </div>
                    <div className="text-[12px] md:text-lg font-semibold ml-1 md:ml-0 text-text2">
                        <p>User Bio here ...</p>
                    </div>
                </div>
            </section>
        </div>
    );
}