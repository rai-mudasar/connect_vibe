
import Image from "next/image";
import { MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react";

export default function PostCard({ author, authorProfileImage, time, content, image, priority }) {

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            {authorProfileImage && (
              <Image
                src={authorProfileImage}
                width={40}
                height={40}
                alt="User Profile Image"
              />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-[15px] hover:underline cursor-pointer">
              {author.firstName} {author.lastName}
            </h4>
            <p className="text-gray-500 text-[13px]">{time}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-[15px]">{content}</p>
      </div>

      {/* Optional Post Image */}
      {image && (
        <div className="w-full bg-gray-100 flex justify-center">
          <div className="w-full h-120 relative">
            <Image
              src={image}
              fill={true}
              alt="Post Image"
              priority={priority}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 flex justify-between text-gray-500 text-[14px] border-b border-gray-100 mx-2">
        <div className="flex items-center space-x-1">
          <div className="bg-blue-500 rounded-full p-1">
            <ThumbsUp size={12} className="text-white" />
          </div>
          <span>124</span>
        </div>
        <div className="flex space-x-3">
          <span>24 comments</span>
          <span>12 shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex px-2 py-1">
        <button className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium">
          <ThumbsUp size={20} /> <span>Like</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium">
          <MessageCircle size={20} /> <span>Comment</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium">
          <Share2 size={20} /> <span>Share</span>
        </button>
      </div>
    </div>
  );
}
