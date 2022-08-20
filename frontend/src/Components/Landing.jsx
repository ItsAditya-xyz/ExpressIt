import { React, useState } from "react";
import NavBar from "./Navabar";
import { Link } from "react-router-dom";
export default function Landing() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <NavBar />
      <div className='pt-28  gradient'>
        <div className='flex container mx-auto px-1 flex-col mt-7 items-center'>
          <h1 className='text-center text-5xl md:text-7xl font-bold primaryTextColor tracking-wide sm:leading-[4rem]'>
            Express your Mental State <br></br> Anonymously
          </h1>
          <p className=' text-center mt-4 text-lg text-gray-800 sm:mt-10 sm:text-2xl primaryTextColor'>
            Share feelings, get help and and support people who are having
            mental breakdown
          </p>

          <Link
            className='primaryColor text-white animate-bounce mt-16 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl'
           to = "/home">
            Get Started
          </Link>

          <div className='flex justify-center flex-col items-center my-6'>
            <div className=' text-lg px-10 py-8 bg-[#ffffff57] rounded-md border border-red-200'>
              Anonymous Speech is Powered by{" "}
              <span className='undeline text-blue-800 underline'>
                <a href='https://deso.org' target={"_blank"}>
                  DeSo Blockchain
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className='bg-white py-12'>
          <h1 className='text-center text-4xl   font-bold primaryTextColor  sm:leading-[3rem]'>
            Unwrap your emotions without being judged
          </h1>
          <p className=' text-center mt-2 text-lg text-gray-800 sm:mt-6 sm:text-2xl primaryTextColor'>
            Expressing your feeling is good for you!
          </p>
          <div className='mx-auto flex flex-wrap my-4  w-full  px-4 sm:px-44 lg:px-72 justify-center'>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-blue-50 w-[16rem] h-[8rem] border-blue-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Communicate about your relationships effectively
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-blue-50 w-[16rem] h-[8rem] border-blue-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Get Emotional and mental stability through confessions
              </div>
            </div>
            <div className=' items-center flex justify-center  flex-col  p-4 '>
              <div className='border bg-blue-50 w-[16rem] h-[8rem] border-blue-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Get help from other community members
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-blue-50 w-[16rem] h-[8rem] border-blue-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Support people who are having mental breakdown
              </div>
            </div>
            <div className=' items-center flex justify-center flex-col   p-4 '>
              <div className='border bg-blue-50 w-[16rem] h-[8rem] border-blue-600 px-8 py-6 rounded-xl  text-center text-lg'>
                Support people who are having mental breakdown
              </div>
            </div>

            {/* <div className='border  bg-green-50 w-[16rem] border-green-600 px-8 py-6 rounded-xl text-center text-lg'>
                Get Emotional and mental stability through confessions
              </div>
              <div className='border bg-green-50 border-green-600 px-8 py-6 rounded-xl w-[16rem] text-center text-lg'>
                Get help from other community members
              </div>
              <div className='border bg-green-50 border-green-600 px-8 py-6 rounded-xl w-[16rem] text-center text-lg'>
                Support people who are having mental breakdown
              </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
