import React from "react";
import timeDifference from "../../api/timeFunc";

export default function Postbox({
  currentTimestamp,
  post,
  desoObj,
  loginState,
  changeLoginState,
}) {
  const [showModal, setShowModal] = React.useState(false);
  const [currentLoginState, setCurrentLoginState] = React.useState(loginState);

  const handleDesoLogin = async () => {
    const response = await desoObj.identity.login(3);
    if (response.key) {
      localStorage.setItem("loggedInKey", response.key);
      setCurrentLoginState(true);
      changeLoginState(response.key);
    }
  };
  return (
    <div className='bg-white border-[0.1rem] border-[#d3d3d3] rounded-lg shadow-sm px-4 pt-2 my-2'>
      <div className='flex items-center space-x-1'>
        <div className='w-11 h-11 primaryColor rounded-full text-white flex items-center px-4 text-lg'>
          A
        </div>
        <div>
          <p className='font-semibold'>Anonymous</p>
          <p className='text-xs'>
            {timeDifference(
              currentTimestamp,
              Math.round(post.TimestampNanos / 1e6)
            )}
          </p>
        </div>
      </div>
      <div className='flex items-center space-x-1 my-3'>
        <div className='w-11 h-11 '></div>
        <p className='overflow-clip'>{post.Body}</p>
      </div>

      <div className='flex items-center space-x-1'>
        <div className='w-11 h-11 '></div>
        <div className='flex justify-around w-3/4'>
          <div className='flex items-center'>
            <button className='fas fa-heart px-2 py-2 text-red-500 rounded-full hover:cursor-not-allowed '></button>
            <p>{post.LikeCount}</p>
          </div>
          <div className='flex items-center'>
            <button className='fas fa-retweet px-2 py-2 text-green-500  rounded-full hover:cursor-not-allowed  '></button>
            <p>{post.RepostCount + post.QuoteRepostCount}</p>
          </div>
          <div className='flex items-center animate-bounce'>
            <button
              onClick={() => setShowModal(true)}
              className='fas fa-comment e px-2 py-2 text-gray-400  hover:pointer rounded-full hover:bg-blue-200'></button>
            <p>{post.CommentCount}</p>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative w-auto my-6 mx-auto max-w-3xl'>
              {/*content*/}
              <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
                {/*header*/}
                <div className='flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t'>
                  <h3 className='text-3xl font-semibold'>Raise the spirits!</h3>
                  <button
                    className='p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                    onClick={() => setShowModal(false)}>
                    <span className='bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none'>
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className='relative p-6 flex-auto'>
                  {!currentLoginState && (
                    <>
                      <p className='overflow-clip'>
                        Login with your Deso Identity to comment on the post.
                        You can still make original post anonymously!
                      </p>
                    </>
                  )}
                  {currentLoginState && (
                    <>
                      <p className='mb-2'>
                        You are replying the user with your Deso Identity. This
                        is has no effect on the original post anoynimity
                      </p>
                      <button
                        className='text-red-400 underline mb-2'
                        onClick={() => {
                          localStorage.removeItem("loggedInKey");
                          window.location.reload()
                        }}>
                        Log Out Deso Identity
                      </button>
                      <textarea
                        placeholder='Reply the user with supportive and kind words ❤️'
                        className='border-[0.12rem] border-[#d3d3d3]  rounded-lg resize-none px-2 py-2 w-full focus:outline-none active:outline-none h-[16rem]'></textarea>
                    </>
                  )}
                </div>
                {/*footer*/}
                <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b'>
                  <button
                    className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  {!currentLoginState && (
                    <button
                      className='bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => handleDesoLogin()}>
                      Login with Deso
                    </button>
                  )}
                  {currentLoginState && (
                    <button
                      className='bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                      type='button'
                      onClick={() => handleDesoLogin()}>
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
        </>
      ) : null}
    </div>
  );
}
