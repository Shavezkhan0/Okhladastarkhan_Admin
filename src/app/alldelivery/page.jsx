"use client";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import LoadingBar from "react-top-loading-bar";

const AllDelivery = () => {
  const [loading, setLoading] = useState(true); // Add a loading state
  const [Delivery, setDelivery] = useState(null)
  // const [Delivery_id, setDelivery_id] = useState(null)
  const [error, setError] = useState(null); // Add an error state
  const { data: session, status: sessionStatus } = useSession();
  const [progress, setProgress] = useState(0);
  const router = useRouter()
  let Delivery_id;



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

    const getDelivery = async () => {
      try {
        const response = await fetch("/api/delivery/getDelivery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setDelivery(data.shops);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDelivery();
  }, [sessionStatus, router]);

  

  const handlechangeActiveDelivery = async () => {
    setProgress(50);
    try {
      const onProduct = async () => {
        const res = await fetch("/api/delivery/activeDelivery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id:Delivery_id}),
        });
        const response = await res.json();

        if (response.success === true) {
          Toastify({
            text: `${response.message}`,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }
      };
      await onProduct();
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // setProductOn(true);
  };

  const handlechangeDeActiveDelivery = async () => {
    setProgress(50);
    try {
      const onProduct = async () => {
        const res = await fetch("/api/delivery/deactiveDelivery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id:Delivery_id}),
        });
        const response = await res.json();

        if (response.success === true) {
          Toastify({
            text: `${response.message}`,
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        }
      };
      await onProduct();
      setProgress(100);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // setProductOn(true);
  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;



  return (
    <div>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={3000}
        onLoaderFinished={() => {
          console.log("Loader finished");
          setProgress(0);
        }}
      />
      <div className='container w-[80vw] mx-auto '>
        <h1 className='text-2xl font-semibold mx-auto text-center pt-6'>All Delivery Boy : {Delivery?.length}</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Image</th>
                      <th scope="col" className="px-6 py-4">Name</th>
                      <th scope="col" className="px-6 py-4">Landmark</th>
                      <th scope="col" className="px-6 py-4">Phone Number</th>
                      <th scope="col" className="px-6 py-4">Email Address</th>
                      <th scope="col" className="px-6 py-4">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Delivery?.slice().reverse().map((product) => {
                      return (
                        <tr key={product._id} className="border-b border-neutral-200 dark:border-white/10 cursor-pointer hover:bg-[#df9eef] hover:text-base">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {product?.image?.[0]?.secure_url ? (
                              <Image
                                src={product.image[0].secure_url}
                                className='object-contain'
                                height={80}
                                width={80}
                                layout='intrinsic'
                                alt='Product Image'
                                style={{ objectFit: 'contain' }}
                              />
                            ) : (
                              'No Image'
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{product?.username}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold max-w-96 text-wrap">{product?.landmark}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.phoneNumber}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.email}</td>
                          <td className="group whitespace-nowrap px-6 py-4 font-semibold">

                            <div className="flex justify-end w-fit md:w-[10vw] pr-3">
                              <div className="w-fit flex border-[2px] rounded-md border-gray-400">
                                <button
                                  onClick={() => {
                                    Delivery_id=product?._id
                                    handlechangeActiveDelivery()
                                  }}
                                  className={` ${product?.active === "true" && "bg-green-400"
                                    } hover:bg-green-600  text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
                                >
                                  Active
                                </button>
                                <button
                                   onClick={() => {
                                    Delivery_id=product?._id
                                    handlechangeDeActiveDelivery()
                                  }}
                                  className={` ${product?.active === "false" && "bg-red-400"
                                    } hover:bg-red-600 text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
                                >
                                  Deactive
                                </button>
                              </div>
                            </div>

                            {/* <CiEdit size={25} onClick={() => {
                                                            router.push(`/delivery/${product?.email}`)
                                                        }} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /> */}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllDelivery;
