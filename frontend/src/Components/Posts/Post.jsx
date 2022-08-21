import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/logo2.svg";
import Deso from "deso-protocol";
import Loader from "../Loader";
import Postbox from "../Feed/Postbox";
import CommentBox from "./CommentBox";

const deso = new Deso();
export default function Post() {
  const params = useParams();
  const postHashHex = params.postHashHex;
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [commentList, setCommentList] = useState(null);
  const timestamp = new Date().getTime();
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const initPosts = async () => {
    if (!postHashHex) return;
    const request = {
      PostHashHex: postHashHex,
      ReaderPublicKeyBase58Check:
        "BC1YLhBLE1834FBJbQ9JU23JbPanNYMkUsdpJZrFVqNGsCe7YadYiUg",
      FetchParents: true,
      CommentOffset: 0,
      CommentLimit: 40,
      AddGlobalFeedBool: false,
      ThreadLevelLimit: 2,
      ThreadLeafLimit: 1,
      LoadAuthorThread: true,
    };
    try {
      const response = await deso.posts.getSinglePost(request);
      if (response) {
        setPost(response.PostFound);
        setCommentList(response.PostFound.Comments);
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  const changeLoginState = (publicKey) => {
    setLoggedInPublicKey(publicKey);
  };

  useEffect(() => {
    const loggedInKey = localStorage.getItem("loggedInKey");
    if (loggedInKey) {
      setLoggedInPublicKey(loggedInKey.toString());
    }
    initPosts();
  }, []);

  return (
    <>
      <nav className='w-full  shadow-sm bg-white '>
        <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
          <div>
            <div className='flex items-center justify-between py-1  md:block'>
              <div className='flex items-center space-x-1'>
                <img src={logo} alt='logo' className='w-auto h-14 ' />
                <Link to='/home'>
                  <h2 className='text-2xl font-bold'>Express It</h2>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div className='my-4'>
        {isLoading && (
          <div className='flex mx-auto justify-center'>
            <Loader />
          </div>
        )}
        {!isLoading && !post && (
          <div className='flex mx-auto justify-center'>
            <p className='text-lg'>Post not found. Please retry.</p>
          </div>
        )}
        {post && (
          <div className='w-full sm:w-3/5 container px-4 mx-auto'>
            <Postbox
              currentTimestamp={timestamp}
              post={post}
              desoObj={deso}
              loginState={loggedInPublicKey}
              changeLoginState={changeLoginState}
              showPostBtn={false}
            />
          </div>
        )}

        {commentList && commentList.length > 0 && (
          <>
            <p className='text-lg mx-auto text-center my-4'>Comments</p>
            <div className='w-full sm:w-3/5 container px-4 mx-auto'>
              {commentList.map((comment) => (
                <CommentBox
                key={comment.PostHashHex}
                  currentTimestamp={timestamp}
                  post={comment}
                  desoObj={deso}
                  loginState={loggedInPublicKey}
                  changeLoginState={changeLoginState}
                />
              ))}
            </div>
          </>
        )}

        {!commentList && !isLoading && (
          <div className='text-lg text-center'>No Comments found</div>
        )}
      </div>
    </>
  );
}
