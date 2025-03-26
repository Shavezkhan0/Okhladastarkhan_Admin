"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ForgotPassword = () => {
  const router = useRouter();

  // const RandomOTP = Math.floor(Math.random() * 1000000)
  const [sendOTP, setSendOTP] = useState(false)
  const [reciveOTP, setreciveOTP] = useState(null)
  const [userEmail, setuserEmail] = useState(null)


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    const user = await fetch("/api/forgotpassword", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const userExist = await user.json();
    setuserEmail(data.email)

    if (userExist.success === true) {

      const r = await fetch("/api/emailotp", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const res = await r.json();
      if (res.success === true) {
        setSendOTP(true)
        setreciveOTP(res.otp)
      }
    }



  };

  const onSubmitOTP = async (data) => {
    if (parseInt(data.otp) === reciveOTP) {
      router.push(`/changepassword?email=${userEmail}`);
    } else {
      console.error("OTP does not match");
    }
  };

  return (
    <div className='mx-auto mt-8'>
      <div className='flex flex-col gap-3 justify-center items-center w-[90vw] md:w-[30vw] mx-auto border-2 shadow-md py-5 px-2'>
        <h1 className='text-2xl font-bold text-pink-600'>Forgot Password</h1>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
            <div className='flex flex-col justify-center items-center py-2'>
              <div className='flex flex-col justify-center items-center gap-2'>
                <div className='w-full flex gap-5 items-center justify-between'>
                  <label className=''>Email</label>
                  <input
                    type="email"
                    className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'
                    placeholder='Enter your email'
                    {...register("email")}
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {
                !sendOTP ? (
                  <button type='submit' className="w-fit text-center mt-2 gap-2 font-semibold text-black bg-pink-500 border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-pink-700 rounded text-sm md:text-base">Continue</button>
                ) : (<></>)
              }
            </div>
          </form>

          {
            sendOTP ? (<form onSubmit={handleSubmit(onSubmitOTP)} className='flex flex-col gap-2'>
              <div className='flex flex-col justify-center items-center py-2'>
                <div className='flex flex-col justify-center items-center gap-2'>
                  <div className='w-full flex gap-5 items-center justify-between'>
                    <label className=''>OTP</label>
                    <input
                      type="text"
                      className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'
                      placeholder='Enter otp'
                      {...register("otp")}
                      autoComplete="otp"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <button type='submit' className="w-fit text-center mt-2 gap-2 font-semibold text-black bg-pink-500 border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-pink-700 rounded text-sm md:text-base">Veryfy OTP</button>
              </div>
            </form>) : (<>
              <div className="flex justify-center items-center py-3" >
                <h1>OTP Not send yet</h1>
              </div>
            </>)

          }
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
