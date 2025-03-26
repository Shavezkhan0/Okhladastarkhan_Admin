"use client"
import { signIn, useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { BiShow, BiHide } from "react-icons/bi";
import LoadingBar from "react-top-loading-bar";

const Login = () => {

    const { data: session, status: sessionStatus } = useSession()
    const router = useRouter()
    const [progress, setProgress] = useState(0);
    const [showpassword, setshowpassword] = useState(false)

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.push("/")
        }
    }, [sessionStatus, router])



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        const { email, password } = data
        setProgress(30);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            setProgress(60);

            if (res.ok) {
                Toastify({
                    text: `Login successfully`,
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                }).showToast();
                setProgress(100);
                setTimeout(() => {
                    router.push('/')
                }, 400);
            } else {
                setProgress(100);
                throw new Error(res.error);
            }

        } catch (error) {
            console.error('Error in login:', error);
            Toastify({
                text: `Details do not match`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
            }).showToast();
        }
    }
    return (
        <>
            <LoadingBar
                color="#f11946"
                progress={progress}
                waitingTime={2000}
                onLoaderFinished={() => {
                    console.log("Loader finished");
                    setProgress(0);
                }}
            />
            <div className='mx-auto mt-8' >
                <div className='flex flex-col gap-3 justify-center items-center w-[95vw] md:w-[50vw] mx-auto border-2 shadow-md py-5 px-14'>
                    <h1 className='text-2xl font-bold text-[#8d24b0]'>Login</h1>

                    <div className="w-full">
                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 '>

                            <div className='flex flex-col  justify-center items-center py-2'>


                                <div className='flex flex-col  justify-center items-center  gap-2  '>





                                    <div className='w-full flex gap-2   items-center justify-between'>
                                        <label className=''>Email</label>
                                        <input type="email" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your email' {...register("email")} autoComplete="email" />
                                    </div>


                                    <div className='w-full flex  gap-2 items-center justify-between'>
                                        <label className=''>Password</label>
                                        <div className='relative w-full'>
                                            <input type={showpassword ? 'text' : "password"} className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter password' {...register("password")} autoComplete="password" />
                                            {
                                                showpassword ? (
                                                    <BiHide onClick={() => setshowpassword(false)} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' size={20} />
                                                ) : (
                                                    <BiShow onClick={() => setshowpassword(true)} className='absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer' size={20} />
                                                )
                                            }
                                        </div>
                                    </div>

                                </div>




                            </div>
                            <div className="flex justify-center items-center">
                                <button type='submit' className="w-fit text-center mt-2 gap-2 font-semibold text-black bg-[#c07cd6] border-0 py-2 p-5 md:px-6 focus:outline-none hover:bg-[#cc43f9] rounded text-sm md:text-base">Login</button>
                            </div>
                            <div >


                                <div className="flex justify-between items-center px-5">
                                    <Link href={'/forgotpassword'} className="cursor-pointer underline" ><h1>Forgot Password</h1></Link>
                                    <Link href={'/signUp'}>
                                        <h1 className='text-lg font-semibold hover:text-[#74288d] text-[#c539f4] cursor-pointer'>SignUp</h1>
                                    </Link>
                                </div>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
