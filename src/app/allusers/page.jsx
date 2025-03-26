"use client";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const AllUsers = () => {
  const [loading, setLoading] = useState(true); 
  const [AllUsers, setAllUsers] = useState(null)
  const [error, setError] = useState(null); 
  const { data: session, status: sessionStatus } = useSession();
  const [progress, setProgress] = useState(0);
  const router = useRouter()



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

    const getAllUsers = async () => {
      try {
        const response = await fetch("/api/user/getAllUsers", {
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
        setAllUsers(data?.AllUsers.AllUsers);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getAllUsers();
  }, [sessionStatus, router]);
 

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
        <h1 className='text-2xl font-semibold mx-auto text-center pt-6'>All Delivery Boy : {AllUsers?.length}</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                  <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                    <tr>
                      <th scope="col" className="px-6 py-4">Image</th>
                      <th scope="col" className="px-6 py-4">Name</th>
                      <th scope="col" className="px-6 py-4">Phone Number</th>
                      <th scope="col" className="px-6 py-4">Email Address</th>
                      <th scope="col" className="px-6 py-4">Landmark</th>
                      <th scope="col" className="px-6 py-4">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AllUsers?.slice().reverse().map((product) => {
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
                          <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.phoneNumber}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.email}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold max-w-96 text-wrap">{product?.landmark}</td>
                          <td className="whitespace-nowrap px-6 py-4 font-semibold max-w-96 text-wrap">{product?.address}</td>
                         
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

export default AllUsers;
