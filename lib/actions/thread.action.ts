"use server"

import { revalidatePath } from 'next/cache'
import Thread from '../models/thread.models'
import User from '../models/user.models'
import { connectToDB } from '../mongoose'

interface CreateThreadParams {
  text: string
  author: string
  communityId: string | null
  path: string
}
export async function createThread({ text, author, communityId, path}: CreateThreadParams) {
  try {
    connectToDB()

    const createdThread = await Thread.create({ text, author, community: null })

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })

    revalidatePath(path)
  } catch(err: any) {
    throw new Error(`Failed to create Thread: ${err.message}`)
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  try {
    connectToDB()

    const skipAmout = (pageNumber - 1) * pageSize
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined]}})
      .sort({ createdAt: 'desc'})
      .skip(skipAmout)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({ 
        path: 'children',
        populate: {
          path: 'author',
          model: User,
          select: "_id name parentId image"
        }
      })

    const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})

    const posts = await postsQuery.exec()
    const isNext = totalPostCount > skipAmout + posts.length

    return { posts, isNext }
  } catch(err: any) {
    throw new Error(`Failed to fetch Thread: ${err.message}`)
  }
}

