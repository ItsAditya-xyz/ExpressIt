import { React, useState, useEffect } from "react";
import desoApi from "../../api/desoAPI";
import InfiniteScroll from "react-infinite-scroll-component";
import logo from "../../assets/logo2.svg";
import Loader from "../Loader";
import Deso from "deso-protocol";
import axios from "axios";
import { Link } from "react-router-dom";
import Postbox from "./Postbox";
const da = new desoApi();
const deso = new Deso();

export default function Feed() {
  const firstPostHashHex =
    "2e7860e2bfa7d2a3757d96f7901c736ecf1f79b1ae0e45a31d499c54c91316ba";
  const [postLoaded, setPostLoaded] = useState(false);
  const [latestPosts, setLatestPosts] = useState(null);
  const [lastPostHashHex, setLastPostHashHex] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const timestamp = new Date().getTime();
  const [loggedInPublicKey, setLoggedInPublicKey] = useState(null);
  const [bodyContent, setBodyContent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postHashHex, setPostHashHex] = useState("");
  const [wasPostSuccessful, setWasPostSuccessful] = useState(false);

  const [remark, setRemark] = useState("");
  
  const initLatestPost = async () => {
    try {
      const latestPosts = await da.getExpressItPosts(lastPostHashHex, 20);

      setLatestPosts(latestPosts["Posts"]);
      setLastPostHashHex(latestPosts["LastPostHashHex"]);
      setPostLoaded(true);
      if (latestPosts["LastPostHashHex"] === firstPostHashHex) {
        setHasMore(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const changeLoginState = (publicKey) => {
    setLoggedInPublicKey(publicKey);
  };

  const handlePost = (async) => {
    if (isPosting) return;
    if (bodyContent.length == 0) {
      alert("Please enter some text to post");
      return;
    }
    setIsPosting(true);
    if (
      new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
      ).test(bodyContent)
    ) {
      window.alert(
        "Please do not include links in your post! Only English words are allowed"
      );
      setIsPosting(false);
      return;
    }

    const request = {
      content: bodyContent,
    };
    axios({
      method: "post",
      url: "https://mintedtweets.cordify.app/expressIt",
      data: request,
    })
      .then((res) => {
        const response = res.data;
        setRemark(response.message);
        if (response.status) {
          setBodyContent("");
          setWasPostSuccessful(true);
          setPostHashHex(response.data.PostEntryResponse.PostHashHex);
          //await for 3 seconds
          new Promise((resolve) => setTimeout(resolve, 2000));
          setShowModal(true);
        } else {
          setShowModal(true);
          setWasPostSuccessful(false);
        }
        setIsPosting(false);
      })
      .catch((err) => {
        console.log(err);
        setIsPosting(false);
        setShowModal(true);
      });
  };

  const fetchMoreData = async () => {
    try {
      const morePost = await da.getExpressItPosts(lastPostHashHex, 20);

      setLatestPosts([...latestPosts, ...morePost["Posts"]]);
      setLastPostHashHex(morePost["LastPostHashHex"]);
      if (latestPosts["LastPostHashHex"] === firstPostHashHex) {
        setHasMore(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(async () => {
    const loggedInKey = localStorage.getItem("loggedInKey");
    if (loggedInKey) {
      setLoggedInPublicKey(loggedInKey.toString());
    }
    await initLatestPost();
  }, []);
  return (
    <>
      <nav className='w-full  shadow-lg bg-white '>
        <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
          <div>
            <div className='flex items-center justify-between py-1  md:block'>
              <div className='flex items-center space-x-1'>
                <img src={logo} alt='logo' className='w-auto h-14 ' />
                <a href='/'>
                  <h2 className='text-2xl font-bold'>Express It</h2>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <div>
        <div className='flex gradient py-6 mt-0.5'>
          <div className='flex container mx-auto px-1 flex-col  items-center t'>
            <h1 className='text-center text-3xl md:text-4xl font-bold primaryTextColor tracking-wide sm:leading-[4rem]'>
              Express your Mental State <br></br> Anonymously
            </h1>
            <p className=' text-center mt-4 text-sm text-gray-800  primaryTextColor'>
              Share feelings, get help and support people who are having
              mental breakdown
            </p>
          </div>
        </div>

        <div className='flex w-3/4  mx-auto'></div>

        <div className='w-full bg-gray-100 flex  flex-wrap-reverse px-2 sm:px-5 pt-10'>
          <div className=' w-[24rem] sm:w-[34rem] md:w-[40rem] mx-auto my-2'>
            <div className='postBox bg-white border-[0.1rem] border-[#d3d3d3] rounded-lg shadow-sm px-4 py-2 '>
              <div className=' flex mt-2 space-x-3'>
                <div className='w-full h-[16rem]'>
                  <textarea
                    id='textArea'
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                    placeholder='How are you feeling today? Share anything about you here!'
                    className='border-[0.12rem] border-[#d3d3d3]  rounded-lg resize-none px-2 py-2 w-full focus:outline-none active:outline-none h-[16rem]'></textarea>
                </div>
              </div>
              <div className='flex justify-center'>
                <button
                  className='primaryColor text-white px-6 py-2 rounded-md hover:shadow-xl shadow-md my-3'
                  onClick={() => {
                    handlePost();
                  }}>
                  {isPosting ? "Posting..." : "Post"}
                </button>
                {showModal ? (
                  <>
                    <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                      <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                        <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                          <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                            <h3 className='text-3xl font-semibold'>
                              {wasPostSuccessful
                                ? "Post Successful!"
                                : "Failed to Make post"}
                            </h3>
                            <button
                              className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                              onClick={() => setShowModal(false)}>
                              <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                                ×
                              </span>
                            </button>
                          </div>
                          {/*body*/}
                          <div className='relative p-6 flex-auto'>{remark}</div>
                          {/*footer*/}
                          <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                            <button
                              className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                              type='button'
                              onClick={() => setShowModal(false)}>
                              Close
                            </button>
                            {wasPostSuccessful && (
                              <Link
                                className='bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                                to={"/posts/" + postHashHex}>
                                View Post
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className='sidebar mx-auto my-2 '>
            <div className='w-[18rem] text-center py-3 primaryColor text-white  rounded-t-md'>
              Platform Guidelines
            </div>
            <div className='rounded-b-md bg-white py-3 px-3 w-[18rem]'>
              <p>1. No personal attack or toxicity</p>
              <p>
                2. You can supoprt people only through your own Deso Identity
              </p>
              <p>3. Images, links and some banned words are not allowed</p>
              <p>4. Only 1 post per 5 minutes</p>
              <p>
                5. IP will be temporarily or permanently banned on rule
                violation{" "}
              </p>
            </div>
          </div>
        </div>

        <div className=' w-full bg-gray-100 flex  flex-wrap-reverse px-2 sm:px-5 pt-10'>
          <div className='w-[24rem] sm:w-[34rem] md:w-[40rem] mx-auto my-2 '>
            <div className='mx-auto'>
              <h1 className='text-center text-3xl md:text-4xl font-bold primaryTextColor tracking-wide sm:leading-[4rem]'>
                Latest Posts
              </h1>

              {postLoaded ? (
                <div className=' my-2 flex justify-center flex-wrap'>
                  <InfiniteScroll
                    className=' mx-auto flex flex-col flex-wrap pt-4 pb-12 '
                    dataLength={latestPosts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                      <div className='flex justify-center'>
                        <Loader />
                      </div>
                    }>
                    {latestPosts.map((post, index) => {
                      return (
                        <Postbox
                          currentTimestamp={timestamp}
                          post={post}
                          key={index}
                          desoObj={deso}
                          loginState={loggedInPublicKey}
                          changeLoginState={changeLoginState}
                          showPostBtn={true}
                        />
                      );
                    })}
                  </InfiniteScroll>
                </div>
              ) : (
                <Loader />
              )}
            </div>
          </div>
          <div className='sidebar mx-auto my-2 '>
            <div className='w-[18rem] text-center py-3  text-white  rounded-t-md'></div>
          </div>
        </div>
      </div>
    </>
  );
}
