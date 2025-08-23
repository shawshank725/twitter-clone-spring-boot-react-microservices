import '@styles/universal.css';
import '@styles/pages-styles/HomePage.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import PostingArea from '@components/posts/PostingArea';
import { useGenerateTimeline } from '@api/query/TimelineQueries';
import { getPostByPostId } from '@api/service/PostingService';
import PostCard from '@components/posts/PostCard';
import type { PostEntity } from '@/types/Posts/PostEntity';
import type { AxiosResponse } from 'axios';

export default function HomePage() {
  useEffect(() => { document.title = "Home" }, []);
  const { authUser } = useAuth();
  const {data: timeline} = useGenerateTimeline(authUser?.id ?? 0);
  const [posts, setPosts] = useState<AxiosResponse<PostEntity, any>[]>([]);

  useEffect(() => {
    if (!timeline) return;

    const fetchPosts = async () => {
      try {
        const results = await Promise.all(
          timeline.map((postId: number) => getPostByPostId(postId))
        );
        const postsData = results.map(res => res.data);
        postsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setPosts(results);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [timeline]);

  return (
    <div className='homePageContainer'>
      <PostingArea userInfo={authUser} />
      {authUser && posts.map((postResponse, index) => (
        <PostCard
          key={postResponse.data.postId ?? index}
          userId={postResponse.data.userId}
          postEntity={postResponse.data}  // <-- pass the actual PostEntity
        />
      ))}
    </div>
  );
}