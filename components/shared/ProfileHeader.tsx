import Image from 'next/image'

interface Props {
  accountId: string
  authUserId: string
  name: string
  imgUrl: string
  bio: string
}

const ProfileHeader = ({
  accountId,
  authUserId,
  name,
  imgUrl,
  bio,
}: Props) => {
  return (
    <div className="flex w-full felx-col justify-start">
      <div className="flex item-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt="Profile image"
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
