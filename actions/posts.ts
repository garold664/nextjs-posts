'use server';
import { redirect } from 'next/navigation';
import { storePost, updatePostLikeStatus } from '@/lib/posts';
import { uploadImage } from '@/lib/cloudinary';
export async function createPost(
  prevState: { errors: string[] },
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
    console.log(title);
    await storePost({
      imageUrl,
      title,
      content,
      userId: 1,
    });
  }

  redirect('/feed');
}
