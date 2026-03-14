import Image from 'next/image'

const UserAvatars = () => {
  // Array of local avatar images
  const avatars = [
    '/images/avartar1.jpg',
    '/images/avartar2.jpg', 
    '/images/avartar3.jpg',
    '/images/avartar4.jpg'
  ]

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-600  rounded-xl shadow-lg p-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center -space-x-4">
          {avatars.map((src, index) => (
            <div 
              key={index}
              className="relative"
              title={`User ${index + 1}`}
            >
              <Image
                src={src}
                alt={`User ${index + 1}`}
                width={48}
                height={48}
                className="
                  relative inline-block 
                  h-12 w-12 
                  rounded-full 
                  border-2 border-white 
                  object-cover object-center 
                  hover:z-10 focus:z-10
                  transition-transform 
                  hover:scale-110
                "
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm font-medium">500+ Happy Users</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="h-4 w-4 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAvatars
