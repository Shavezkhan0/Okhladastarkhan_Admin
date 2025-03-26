"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const ChangePassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter()
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password === data.repassword) {
      data = { ...data, email: email };
      const r = await fetch("/api/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await r.json();
      if (res.success = true) {
        Toastify({
          text: `Password Changed successfully`,
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
        }).showToast();

        setTimeout(() => {
          router.push("/login")
        }, 400);
      }
    } else {
      Toastify({
        text: `Password not same`,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" },
      }).showToast();
    }
  };
  return (
    <div className="mx-auto mt-8">
      <div className="flex flex-col gap-3 justify-center items-center w-[90vw] md:w-[30vw] mx-auto border-2 shadow-md py-5 px-2">
        <h1 className="text-2xl font-bold text-pink-600">Forgot Password</h1>

        <div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 "
          >
            <div className="flex flex-col  justify-center items-center py-2">
              <div className="flex flex-col  justify-center items-center  gap-2  ">
                <div className="w-full flex gap-5  items-center justify-between">
                  <label className="">New Password</label>
                  <input
                    type="password"
                    className="bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1"
                    placeholder="Enter New Password"
                    {...register("password")}
                    autoComplete="password"
                  />
                </div>

                <div className="w-full flex gap-5  items-center justify-between">
                  <label className="">Re Enter Password</label>
                  <input
                    type="password"
                    className="bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1"
                    placeholder="Re Enter Password"
                    {...register("repassword")}
                    autoComplete="repassword"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="w-fit text-center mt-2 gap-2 font-semibold text-black bg-pink-500 border-0 py-2 px-5 md:px-6 focus:outline-none hover:bg-pink-700 rounded text-sm md:text-base"
              >
                Save Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
