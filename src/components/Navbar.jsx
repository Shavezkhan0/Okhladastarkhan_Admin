
'use client'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaUser } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import LoadingBar from "react-top-loading-bar";
import "toastify-js/src/toastify.css";



const Navbar = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter()

  const [accont, setaccont] = useState(false)

  const [progress, setProgress] = useState(0);

  const email = session?.user?.email;


  const handleSignOut = async () => {
    await signOut();
    router.push('/login')
  }



  const toggleDropdown = () => setDropdownOpen(prev => !prev);


  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={2000}
        onLoaderFinished={() => {
          console.log("Loader finished"); // Debugging statement
          setProgress(0);
        }}
      />
      <div className='flex   flex-col mb-2 py-2 px-2 w-full shadow-lg md:flex-row md:justify-between justify-center items-center bg-white sticky z-10 top-0 '>


        <div className='flex flex-row  px-2 w-full  items-center justify-between '>
          <div className='flex flex-col md:flex-row md:items-center  justify-start md:gap-10'>
            <div className='flex justify-start items-start text-start'>
              <Link href={"/"}>
                <Image
                  className="cursor-pointer w-12 sm:w-16 md:w-20 lg:w-24 xl:w-28"
                  src="/logo.png"
                  height={40}
                  width={120}
                  alt="logo"
                  style={{ height: 'auto', width: 'auto' }}
                />
              </Link>
            </div>
            <div>
              <ul className='flex md:gap-5 gap-3 md:py-5 flex-wrap font-semibold md:font-bold md:text-base items-center'>
                <Link onClick={() => setProgress(100)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' href="/home"><li>Home</li></Link>
                <Link onClick={() => setProgress(100)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' href="/allshops"><li>All Shops</li></Link>
                <Link onClick={() => setProgress(100)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' href="/allusers"><li>All Users</li></Link>
                <Link onClick={() => setProgress(100)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' href="/alldelivery"><li>All Delivery</li></Link>
                <Link onClick={() => setProgress(100)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' href="/allorders"><li>All Orders</li></Link>
              </ul>
            </div>
          </div>
          <div className='overflow-x-hidden justify-end pr-2 items-end text-end'>
            <div className='flex items-center pr-5' >
              {
                session && session.user ? (
                  <>
                    <div onMouseEnter={() => setaccont(!accont)} onMouseLeave={() => setaccont(!accont)}>

                      <div className='flex items-center justify-center space-x-2 cursor-pointer'>
                        <h1 className='font-bold text-xl hidden md:block'>{session.user.username || session.user.name}</h1>
                        <FaUser size={22} className=' text-[#c545ec]' />
                      </div>
                      {
                        accont && <div className='absolute top-24 md:top-12 md:right-14 right-10 bg-[#de90f5e2] py-2 px-3 rounded-md border-[2px] w-40 mr-3 border-[#af2ed7]'>
                          <div className='flex flex-col items-start justify-start gap-2'>
                            <Link href={"/profile"}> <h1 className='cursor-pointer hover:underline ring-offset-4  font-semibold outline-fuchsia-300'>My Account</h1></Link>
                            <Link href={"/orders"}> <h1 className='cursor-pointer hover:underline ring-offset-4 font-semibold outline-fuchsia-300'>My Orders</h1></Link>
                            <button
                              onClick={handleSignOut}
                              className="w-fit text-center mt-2 gap-2 flex justify-center items-center font-semibold text-black bg-[#d568f6] border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-[#c545ec] rounded text-sm md:text-base"
                            >
                              Logout <MdLogout />
                            </button>
                          </div>
                        </div>
                      }</div>
                  </>
                ) : (
                  <>
                    <Link href={'/login'}><button className='cursor-pointer flex items-center   text-white bg-[#b54ed4] border-0 py-1 mr-5 px-2 focus:outline-none hover:bg-[#a436c6] rounded text-base '>Login</button>
                    </Link>
                  </>
                )
              }
            </div>

          </div>
        </div>


      </div>

    </>
  )
}

export default Navbar;
