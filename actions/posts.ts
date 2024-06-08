'use server';
import { redirect } from 'next/navigation';
import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { uploadImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function createPost(
  _prevState: { errors: string[] },
  formData: FormData
) {
  const title = formData.get('title') as string | null;
  const image = formData.get('image') as File | null;
  const content = formData.get('content') as string | null;

  let errors: string[] = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (!content || content.trim().length === 0) {
    errors.push('Content is required');
  }

  if (!image || image.size === 0) {
    errors.push('Image is required');
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl: string;
  try {
    imageUrl = await uploadImage(image as File);
  } catch (err) {
    throw new Error('Error uploading image');
  }

  if (
    title &&
    title.trim().length > 0 &&
    content &&
    content.trim().length > 0 &&
    imageUrl
  ) {
    await storePost({
      imageUrl,
      title,
      content,
      userId: 1,
    });
  }
  revalidatePath('/feed');
  redirect('/feed');
}

export async function togglePostLikeStatus(postId: number) {
  await updatePostLikeStatus(postId, 2);
  revalidatePath('/feed');
}
