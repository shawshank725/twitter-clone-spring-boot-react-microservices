import ErrorMessage from "@components/ErrorMessage";
import PostCard from "@components/posts/PostCard";
import type { PostEntity } from "@/types/Posts/PostEntity";
import { useGetQuotePosts } from "@api/query/QuoteRetweetQueries";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function QuoteRetweetPage() {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const postIdNumber = Number.parseInt(postId!);
    const {data: quotePosts} = useGetQuotePosts(postIdNumber);

    useEffect(() => {
        if (postId) {
            document.title = `Quote posts for post id: ${postId}`;
        }
    }, [postId]);

    return (
        <div style={{width:"100%", height:"100%", display:"flex", flexDirection:"column"}}>
            <div className="notificationHeadingContainer">
                <div className="arrowLeftNotificationViewerHeaderContainer">
                    <ArrowLeft
                        className="arrowLeftNotificationViewerHeader"
                        size={20}
                        onClick={() => {
                            if (window.history.length > 1) {
                                navigate(-1);
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                </div>
                <span className="notificationHeaderHeadingSpan">Quote posts for post id: {postId}</span>
            </div>
            {
                quotePosts && quotePosts?.data.length > 0 ? (
                    quotePosts.data.map((post:PostEntity, index: number)=> (
                        <PostCard userId={post.userId} postEntity={post} key={index}/>
                    ))
                ) : (
                    <ErrorMessage title={"No quoted posts found."} message={"This post isn't quote retweeted by anyone."} />
                )
            }

        </div>
    )
}