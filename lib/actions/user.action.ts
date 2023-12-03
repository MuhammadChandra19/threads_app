"use server"

import { connectToDB } from '@/lib/mongoose'
import User from '@/lib/models/user.models'
import { revalidatePath } from 'next/cache'



type TUpdateUser = {
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
}

export async function updateUser({ userId, username, name, bio, image, path}: TUpdateUser): Promise<void> {
  connectToDB()
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      {upsert: true}
    )

    console.log()
  
    if(path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch(err: any) {
    throw new Error(`Failed to create/update user: ${err.message}`)
  }
}