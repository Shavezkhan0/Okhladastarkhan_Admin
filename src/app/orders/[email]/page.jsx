"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { GoDotFill } from "react-icons/go";

const Orders = ({ params }) => {
    const { email } = params; 
    const decodedEmail = decodeURIComponent(email);
    

    const [orders, setOrders] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const { data: session, status: sessionStatus } = useSession();
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

        const getOrders = async () => {
            try {
                const response = await fetch("/api/getOrders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email :decodedEmail})
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [sessionStatus, router, email]);

   

   

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className='container w-[80vw] mx-auto '>
                <h1 className='text-2xl font-semibold mx-auto text-center pt-6'>All Orders </h1>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table
                                    className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                                    <thead
                                        className="border-b border-neutral-200 font-medium dark:border-white/10">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">#OrderId</th>
                                            <th scope="col" className="px-6 py-4">Name</th>
                                            <th scope="col" className="px-6 py-4">Quantity</th>
                                            <th scope="col" className="px-6 py-4">Price</th>
                                            <th scope="col" className="px-6 py-4">Total Price</th>
                                            <th scope="col" className="px-6 py-4">Address</th>
                                            <th scope="col" className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            orders?.Orders?.slice().reverse().map((item) => {

                                                const updatedAt = new Date(item.updatedAt);
                                                const formattedDate = updatedAt.toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                });
                                                const formattedTime = updatedAt.toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                                return (
                                                    <tr key={item.orderId} onClick={() => {
                                                        router.push(`/order/${item._id}`)
                                                    }}
                                                    className="border-b border-neutral-200  dark:border-white/10 cursor-pointer hover:bg-[#e5a7f4] hover:text-base">
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                            <h1>{item.orderId}</h1>
                                                            <span>Date: {formattedDate}</span><br />
                                                            <span>Time: {formattedTime}</span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium ">
                                                            {item?.products?.map((products) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            products.shopemail === decodedEmail &&
                                                                            <h1 className='flex justify-start items-center gap-2'><GoDotFill /> {products.name}</h1>

                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium ">
                                                            {item?.products?.map((products) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            products.shopemail === decodedEmail &&
                                                                            <h1 className='justify-center items-center'>{products.quantity}</h1>
                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium ">
                                                            {item?.products?.map((products) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            products.shopemail === decodedEmail &&
                                                                            <div>
                                                                                <h1>{products.price}</h1>
                                                                            </div>
                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium ">
                                                            {item?.products?.map((products) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            products.shopemail === decodedEmail &&
                                                                            <div>
                                                                                <h1>{products.price*products.quantity}</h1>
                                                                            </div>
                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                            <h1>{item.address}</h1>
                                                            <span>Phone Number: {item.phoneNumber}</span>
                                                        </td>
                                                        {
                                                            item?.deliverystatus?.deliver === "pending" ? (

                                                                <td className="whitespace-nowrap px-6 py-4  font-semibold text-blue-700">
                                                                    {item?.deliverystatus?.deliver}
                                                                </td>
                                                            ) : item?.deliverystatus?.deliver === "success" ? (

                                                                <td className="whitespace-nowrap px-6 py-4  font-semibold text-green-600">
                                                                    {item?.deliverystatus?.deliver}
                                                                </td>
                                                            ) : (

                                                                <td className="whitespace-nowrap px-6 py-4  font-semibold text-red-600">
                                                                    <h1>{item?.deliverystatus?.deliver}</h1>
                                                                    {/* <button onClick={() => cancelledOrder()} className="disabled:bg-pink-200 group  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-red-500 border-0 py-2 px-2 focus:outline-none hover:bg-red-700 rounded text-sm  cursor-pointer">Cancel <ImCancelCircle size={15} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /></button> */}
                                                                </td>
                                                            )
                                                        }


                                                    </tr>
                                                )
                                            })
                                        }
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

export default Orders;
