"use client";
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdLogout } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { ToastContainer, toast } from 'react-toastify';
import { Buffer } from 'buffer';
import axios from 'axios';
import LoadingBar from "react-top-loading-bar";

const Profile = () => {
    const { data: session, status: sessionStatus } = useSession();
    const [isSigningOut, setIsSigningOut] = useState(false);
    const router = useRouter();
    const [user, setuser] = useState(null)
    const [userEdit, setuserEdit] = useState(false)
    const [addressEdit, setaddressEdit] = useState(false)
    const [allPin, setallPin] = useState(null)
    const [isServiceable, setisServiceable] = useState(null)
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [userImage, setuserImage] = useState(null)
    const [progress, setProgress] = useState(0);

    const email = session?.user?.email;


    const {
        register: registerUser,
        handleSubmit: handleSubmitUser,
        setValue: setvalueUser,
        formState: { errors: errorsUser, isSubmitting: isSubmittingUser },
    } = useForm({})


    useEffect(() => {

        if (sessionStatus !== "authenticated") {
            Toastify({
                text: `Login first`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
            }).showToast();
            router.push("/login")
        }


        const getUser = async () => {
            const res = await fetch("/api/user/getUser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })
            const response = await res.json()
            setuser(response.user)
            setuserImage(response.user.user[0].image[0])

        }

        getUser()
        setvalueUser("email", email)


        const pincode = async () => {
            const r = await fetch("/api/pincode")
            const res = await r.json()
            setallPin(res)
        }
        pincode()

    }, [sessionStatus, router, email, setvalueUser]);


    const signout = async () => {
        setIsSigningOut(true);
        await signOut();
        router.push('/');
    }




    const onSubmitUser = async (data) => {
        setProgress(20)
        try {

            const res = await fetch("/api/user/updateuserprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const response = await res.json()
            setProgress(80)

            if (response.success === true) {
                Toastify({
                    text: `${response.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                }).showToast();
            }

            setProgress(100)
        } catch (error) {
            Toastify({
                text: `${response.message}`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #ff0000, #ff6666)" },
            }).showToast();
            console.error('Error submitting form:', error)
        }

    }





    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    } = useForm({})

    const onSubmitPassword = async (data) => {
        setProgress(20)
        data = { ...data, email }


        if (data.newpassword === data.repassword) {

            try {
                setProgress(40)
                const res = await fetch("/api/user/updateuserpassword", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                const response = await res.json()
                setProgress(80)
                if (response.success === false) {
                    Toastify({
                        text: `${response.message}`,
                        duration: 3000,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        style: { background: "linear-gradient(to right, #ff0000, #990000)" },
                    }).showToast();
                }

                if (response.success === true) {
                    Toastify({
                        text: `${response.message}`,
                        duration: 3000,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                    }).showToast();
                }
                setProgress(100)
            } catch (error) {
                Toastify({
                    text: `${response.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #ff0000, #ff6666)" },
                }).showToast();
                console.error('Error submitting form:', error)
            }

        } else {
            Toastify({
                text: `Password not same`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #ff0000, #ff6666)" },
            }).showToast();
        }


    }





    const {
        register: registerAddress,
        handleSubmit: handleSubmitAddress,
        setValue: setValueAddress,
        formState: { errors: errorsAddress, isSubmitting: isSubmittingAddress },
    } = useForm({
        mode: 'onChange',
        reValidateMode: 'onBlur',

    })

    const onSubmitAddress = async (data) => {
        setProgress(40)
        data = { ...data, email }

        try {

            const res = await fetch("/api/user/updateuseraddress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const response = await res.json()
            setProgress(80)
            if (response.success === false) {
                Toastify({
                    text: `${response.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #ff0000, #990000)" },
                }).showToast();
            }

            if (response.success === true) {
                Toastify({
                    text: `${response.message}`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                }).showToast();
            }
            setProgress(100)
        } catch (error) {
            Toastify({
                text: `${response.message}`,
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                style: { background: "linear-gradient(to right, #ff0000, #ff6666)" },
            }).showToast();
            console.error('Error submitting form:', error)
        }



    }

    const handleChangePincode = (e) => {
        const pincode = e.target.value;
        if (pincode.length === 6) {
            if (pincode.length === 6 && allPin[pincode]) {
                setValueAddress("city", allPin[pincode].city);
                setValueAddress("state", allPin[pincode].state);
                setValueAddress("country", allPin[pincode].country);
                setisServiceable(true)
            } else {
                setisServiceable(false)
                setValueAddress("pincode", {
                    type: "manual",
                    message: "This pincode code is not serviceable"
                });
                Toastify({
                    text: `This pincode code is not serviceable`,
                    duration: 3000,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    style: { background: "linear-gradient(to right,#ff0000, #ff6666)" },
                }).showToast();
                return ("This Pincode is not servicable");

            }
        }

    }



    const handleImageChange = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
            setImage(file);
        }
    };

    const handlesave = async () => {
        setProgress(20)
        const formData = new FormData();
        if (mainImage) formData.append('files', mainImage);

        const deleteImage = async (publicId) => {
            if (!publicId) {
                console.error('No public_id provided');
                return;
            }

            try {
                const response = await fetch('/api/delete/deleteImage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ public_id: publicId }),
                });
                const data = await response.json();
                if (data.success) {
                    console.log('Image deleted successfully:', data);
                } else {
                    console.error('Error deleting image:', data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        console.log(userImage?.public_id)

        deleteImage(user?.user[0]?.image[0]?.public_id);
        setProgress(60)

        try {
            const response = await axios.post('/api/upload/uploadProductImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // const data = { email, image: response.data.urls }

            const data = {
                email,
                image: response.data.image.map(img => ({
                    public_id: img.public_id,
                    secure_url: img.secure_url
                }))
            };

            setProgress(80)
            const uploadImage = async () => {

                const res = await fetch("/api/user/updateuserImg", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });
                const response = await res.json()

                if (response.success === false) {
                    Toastify({
                        text: `${response.message}`,
                        duration: 3000,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        style: { background: "linear-gradient(to right, #ff0000, #990000)" },
                    }).showToast();
                }

                if (response.success === true) {
                    Toastify({
                        text: `${response.message}`,
                        duration: 3000,
                        close: true,
                        gravity: "top", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
                    }).showToast();
                }

            }
            await uploadImage()

            setProgress(100)

        } catch (error) {
            toast.error('Image upload failed!');
            console.error(error);
        }

    }





    if (isSigningOut) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">Signing out...</h1>
            </div>
        );
    }


    return (
        <div>
            <LoadingBar
                color="#f11946"
                progress={progress}
                waitingTime={2000}
                onLoaderFinished={() => {
                    console.log("Loader finished"); // Debugging statement
                    setProgress(0);
                }}
            />
            <section className="text-gray-600 body-font">
                <div className=" mx-auto px-2 md:px-0 py-5 items-center  flex flex-col">
                    <div className="lg:w-4/6 w-full">
                        <div className="flex flex-col  mx-0 px-0  sm:flex-row mt-10">

                            <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">



                                <div className="flex items-center justify-center">
                                    <label htmlFor="mainImage" className="flex flex-col items-center justify-center relative w-[80vw] h-[65vh] md:w-64 md:h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                        {mainImagePreview || user?.user[0]?.image ? (
                                            <Image
                                                src={mainImagePreview || userImage?.secure_url}
                                                alt="Profile Image"
                                                className="cursor-pointer object-contain w-full h-full"
                                                width={800}
                                                height={450}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full">
                                                <svg className="w-12 h-12 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </div>
                                        )}
                                        <input id="mainImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setMainImage, setMainImagePreview)} />
                                    </label>
                                </div>







                                <div className="flex flex-col items-center text-center justify-center">

                                    <button onClick={() => handlesave()} className="disabled:bg-[#d997ed]  w-42 text-center mt-2 flex justify-center items-start gap-1 font-semibold text-black bg-[#d586ed] border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-[#ce45f7] rounded text-sm md:text-base cursor-pointer"><FiSave /></button>
                                    <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                                        {session?.user?.username || session?.user?.name || user?.user[0]?.username}
                                    </h2>
                                </div>
                            </div>

                            <div className="sm:w-2/3 sm:pl-8 sm:py-8 flex flex-col md:justify-start md:items-start justify-center items-center sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                <div className='text-xl font-bold py-2 flex justify-center items-center group gap-2 '>User Details <CiEdit size={25} onClick={() => setuserEdit(true)} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /></div>
                                <div className='text-start'>
                                    <h1 ><span className='items-center font-medium text-lg'>Username :</span> <span > {session?.user?.username || session?.user?.name || user?.user[0]?.username}</span> </h1>
                                    <h1><span className='items-center font-medium text-lg'>Email :</span><span >{session?.user?.email || user?.user[0]?.email}</span> </h1>
                                    <div><span className='items-center font-medium text-lg'>Phone Number :</span><span >{session?.user?.phoneNumber || user?.user[0]?.phoneNumber ? (<h1>{session?.user?.phoneNumber || user?.user[0]?.phoneNumber}</h1>) : (<h1>Not Available</h1>)} </span></div>
                                    <Link href={"/orders"}> <h1 className='cursor-pointer hover:text-lg hover:text-[#d175ed] hover:underline font-bold ring-offset-4 outline-fuchsia-300'>My Orders</h1></Link>
                                </div>
                                <button
                                    onClick={signout}
                                    className="w-fit text-center mt-5 gap-2 flex justify-center items-center font-semibold text-black bg-[#d27bed] border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-[#cc45f5] rounded text-sm md:text-base"
                                >
                                    Logout <MdLogout />
                                </button>
                            </div>

                            <div className="sm:w-2/3 sm:pl-8 sm:py-8 flex flex-col md:justify-start md:items-start justify-center items-center sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                                <div className='text-xl font-bold py-2 flex justify-center items-center group gap-2 '>Address <CiEdit size={25} onClick={() => setaddressEdit(true)} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /></div>
                                <div className='text-start'>
                                    <h1> <span className='items-center font-medium text-lg'>Address : </span> <span> {user?.user[0]?.address}</span>  </h1>
                                    <h1> <span className='items-center font-medium text-lg'>Landmark : </span> <span> {user?.user[0]?.landmark}</span>  </h1>
                                    <h1> <span className='items-center font-medium text-lg'>Pincode : </span> <span> {user?.user[0]?.pincode}</span>  </h1>
                                    <h1> <span className='items-center font-medium text-lg'>City : </span> <span> {user?.user[0]?.city}</span>  </h1>
                                    <h1> <span className='items-center font-medium text-lg'>State : </span> <span> {user?.user[0]?.state}</span>  </h1>
                                    <h1> <span className='items-center font-medium text-lg'>Country : </span> <span> {user?.user[0]?.country}</span>  </h1>
                                </div>


                            </div>



                        </div>
                    </div>
                </div>
            </section>


            {
                userEdit && <div className='absolute top-0  z-20 bg-white opacity-90 min-h-[200vh] w-screen'>
                    <div className='flex justify-end pr-10 cursor-pointer pt-10 '><IoMdClose size={40} onClick={() => setuserEdit(false)} /></div>
                    <div>
                        <div className='md:w-[90vw] w-[100vw] mx-auto'>
                            <form onSubmit={handleSubmitUser(onSubmitUser)} className='flex flex-col gap-2 px-4'>
                                <div >
                                    <h2 className='font-semibold'>1. User Details</h2>
                                    <div className='py-2'>

                                        <div className='flex flex-col gap-2 px-4'>
                                            <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>
                                                <div className='w-full flex  items-center justify-between'>
                                                    <label className=''>User Name</label>
                                                    <div className='flex flex-col'>
                                                        <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your first name' {...registerUser("username", { required: true })} />
                                                        {errorsUser.username && <div className='text-xs text-red-500'>This field is required</div>}
                                                    </div>
                                                </div>

                                                <div className='w-full  flex  items-center justify-between'>
                                                    <label className=''>Email</label>
                                                    <div className='flex flex-col'>
                                                        <input type="email" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your last name' {...registerUser("email")} readOnly={true} />
                                                    </div>
                                                </div>

                                            </div>

                                            <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>
                                                <div className='w-full flex  items-center justify-between'>
                                                    <label className=''>Phone Number</label>
                                                    <div className='flex flex-col'>
                                                        <input type="number" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your phone number' {...registerUser("phoneNumber", {
                                                            required: "This field is required", minLength: { value: 10, message: 'Minimum length is 10 ' },
                                                            maxLength: { value: 10, message: 'Maximum length is 10' },
                                                        })} />
                                                        {errorsUser.phoneNumber && <div className='text-xs text-red-500'>{errorsUser.phoneNumber.message}</div>}
                                                    </div>
                                                </div>
                                                <div className='w-full flex  items-center justify-between'>

                                                </div>
                                            </div>


                                        </div>


                                    </div>
                                </div>



                                <div className='flex flex-row justify-end items-center pr-4'>


                                    <button type='submit' disabled={isSubmittingUser} className="disabled:bg-[#e8b3f8]  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-[#c574dd] border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-[#d045fa] rounded text-sm md:text-base cursor-pointer"><FiSave />Profile</button>


                                </div>
                            </form>
                        </div>
                        <div className='md:w-[90vw] w-[100vw] mx-auto'>
                            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className='flex flex-col gap-2 px-4'>
                                <div >
                                    <h2 className='font-semibold'>1. Delivery Details</h2>
                                    <div className='py-2'>

                                        <div className='flex flex-col gap-2 px-4'>
                                            <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>
                                                <div className='w-full flex  items-center justify-between'>
                                                    <label className=''>Old Password</label>
                                                    <div className='flex flex-col'>
                                                        <input type="password" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your first name' {...registerPassword("oldpassword", { required: true })} />
                                                        {errorsPassword.oldpassword && <div className='text-xs text-red-500'>This field is required</div>}
                                                    </div>
                                                </div>

                                                <div className='w-full  flex  items-center justify-between'>

                                                </div>

                                            </div>

                                            <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>
                                                <div className='w-full flex  items-center justify-between'>
                                                    <label className=''>New Password</label>
                                                    <div className='flex flex-col'>
                                                        <input type="password" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter new password' {...registerPassword("newpassword", { required: true })} />
                                                        {errorsPassword.newpassword && <div className='text-xs text-red-500'>This field is required</div>}
                                                    </div>
                                                </div>
                                                <div className='w-full flex  items-center justify-between'>
                                                    <label className=''>Re Password</label>
                                                    <div className='flex flex-col'>
                                                        <input type="password" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Re enter password' {...registerPassword("repassword", { required: true })} />
                                                        {errorsPassword.repassword && <div className='text-xs text-red-500'>This field is required</div>}
                                                    </div>
                                                </div>
                                            </div>








                                        </div>


                                    </div>
                                </div>



                                <div className='flex flex-row justify-end items-center pr-4'>


                                    <button type='submit' disabled={isSubmittingPassword} className="disabled:bg-[#e8b3f8]  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-[#ba6bd2] border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-[#d045fb] rounded text-sm md:text-base cursor-pointer"><FiSave />Password</button>


                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }




            {
                addressEdit && <div className='absolute top-0  z-20 bg-white opacity-90 min-h-[200vh] w-[100vw]'>
                    <div className='flex justify-end'><IoMdClose className='cursor-pointer mr-5 my-3' size={40} onClick={() => setaddressEdit(false)} /></div>
                    <div>
                        <form onSubmit={handleSubmitAddress(onSubmitAddress)} className='flex flex-col gap-2 px-4'>
                            <div className='md:w-[90vw] w-[95vw] mx-auto'>
                                <h2 className='font-semibold'>1. Update Address</h2>
                                <div className='py-2'>

                                    <div className='flex flex-col gap-2 px-4'>

                                        <div className='flex gap-2 '>
                                            <label className=''>Address</label>
                                            <div className='flex flex-col w-[90vw]'>
                                                <textarea type="text" rows={2} className='bg-gray-200   bottom-2 w-full border-black rounded-sm px-2 py-1' placeholder='Enter your Address' {...registerAddress("address", { required: true })} />
                                                {errorsAddress.address && <div className='text-xs text-red-500'>This field is required</div>}
                                            </div>
                                        </div>

                                        <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>

                                            <div className='w-full flex  items-center justify-between'>
                                                <label className=''>Landmark</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Landmark' {...registerAddress("landmark", { required: true })} />
                                                    {errorsAddress.landmark && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                            <div className='w-full flex  items-center justify-between'>

                                            </div>
                                        </div>


                                        <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>
                                            <div className='w-full flex  items-center justify-between'>
                                                <label className=''>Pincode</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your pincode' {...registerAddress("pincode", {
                                                        required: "This field is required", onChange: handleChangePincode, minLength: { value: 6, message: 'Minimum length is 6 characters' },
                                                        maxLength: { value: 6, message: 'Maximum length is 6 characters' },
                                                    })} />
                                                    {errorsAddress.pincode && <div className='text-xs text-red-500'>{errorsAddress.pincode.message}</div>}
                                                </div>
                                            </div>

                                            <div className='w-full flex  items-center justify-between'>
                                                <label className=''>State</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your state' {...registerAddress("state", { required: true })} />
                                                    {errorsAddress.state && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col md:flex-row  items-center md:gap-10 gap-2  '>


                                            <div className='w-full flex  items-center justify-between'>
                                                <label className=''>City</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your city' {...registerAddress("city", { required: true })} />
                                                    {errorsAddress.city && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                            <div className='w-full flex  items-center justify-between'>
                                                <label className=''>Country</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your country' {...registerAddress("country", { required: true })} />
                                                    {errorsAddress.country && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>
                            </div>



                            <div className='flex flex-row justify-end items-center pr-4'>



                                <button type='submit' disabled={isSubmittingAddress} className="disabled:bg-[#e3b4f2]  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-[#d18ae9] border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-[#cc44f9] rounded text-sm md:text-base cursor-pointer"><FiSave />Profile</button>



                            </div>
                        </form>

                    </div>
                </div>
            }

        </div>
    );
}

export default Profile;
