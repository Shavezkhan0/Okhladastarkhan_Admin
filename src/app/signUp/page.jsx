"use client"
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { BiShow, BiHide } from "react-icons/bi";


const SignUp = () => {

    const { data: session, status: sessionStatus } = useSession()
    const route = useRouter()
    const [showpassword, setshowpassword] = useState(false)


    useEffect(() => {
        if (sessionStatus === "authenticated") {
            route.push("/")
        }

    }, [sessionStatus, route])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {

        try {
            const response = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            const res = await response.json()

            if (res.success === false) {
                Toastify({
                    text: `${res.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
                }).showToast();
            }


            if (res.success === true) {
                Toastify({
                    text: `${res.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                }).showToast();
                setTimeout(() => {
                    route.push('/login')
                }, 500);
            }
            else {
                // console.error('Error signing up user:', res);
                Toastify({
                    text: `${res.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
                }).showToast();
            }
        } catch (error) {
            console.error('Error submitting form:', error)
        }

    }
    return (
        <div className='mx-auto mt-4' >
            <div className='flex flex-col justify-center items-center w-[95vw] md:w-[50vw] mx-auto border-2 shadow-md py-5 px-5'>
                <h1 className='text-2xl font-bold text-[#8122a1] pb-3'>SignUp</h1>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 '>

                        <div className='flex flex-col  justify-center items-center py-2'>


                            <div className='flex flex-col  justify-center items-center  gap-2  '>

                                <div className='w-full flex  gap-2 items-center justify-between'>
                                    <label className=''>Name</label>
                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Shop Name' {...register("username")} autoComplete="username" />
                                </div>



                                <div className='w-full flex gap-2  items-center justify-between'>
                                    <label className=''>Email</label>
                                    <input type="email" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your email' {...register("email")} autoComplete="email" />
                                </div>

                                <div className='w-full flex  gap-2 items-center justify-between'>
                                    <label className=''>Phone Number</label>
                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your phone number' {...register("phoneNumber")} autoComplete="phoneNumber" />
                                </div>

                                <div className='w-full flex  gap-2 items-center justify-between'>
                                    <label className=''>Password</label>
                                    <div className='relative'>
                                        <input type={showpassword ? 'text' : "password"} className='bg-gray-200 w-full bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter password' {...register("password")} autoComplete="password" />
                                        {showpassword ? (
                                            <BiHide onClick={() => setshowpassword(false)} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' size={20} />
                                        ) : (
                                            <BiShow onClick={() => setshowpassword(true)} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' size={20} />
                                        )}
                                    </div>
                                </div>



                            </div>


                        </div>
                        <div className="flex justify-center items-center">
                            <button type='submit' className="w-fit text-center mt-2 gap-2 font-semibold text-black bg-[#b161cc] border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-[#822b9f] rounded text-sm md:text-base">SignUp</button>
                        </div>

                        <div className="flex flex-col gap-2 justify-between items-center">
                            <div >
                                <Link href={'/login'}>
                                    <h1 className='text-lg font-semibold hover:text-[#74288d] text-[#a347c1] cursor-pointer'>Login</h1>
                                </Link>
                            </div>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default SignUp
