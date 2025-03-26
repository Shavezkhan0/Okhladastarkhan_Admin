"use client";
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const MyProduct = () => {
    const [Products, setProducts] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true); // Add a loading state
    const [error, setError] = useState(null); // Add an error state
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter()

    const email = session?.user?.email;

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
                const response = await fetch("/api/getproducts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
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
                <h1 className='text-2xl font-semibold mx-auto text-center pt-6'>My Products </h1>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Image</th>
                                            <th scope="col" className="px-6 py-4">Name</th>
                                            <th scope="col" className="px-6 py-4">Description</th>
                                            <th scope="col" className="px-6 py-4">Category</th>
                                            <th scope="col" className="px-6 py-4">Food Category</th>
                                            <th scope="col" className="px-6 py-4">Price</th>
                                            <th scope="col" className="px-6 py-4">Edit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Products?.products?.slice().reverse().map((product) => (
                                            <tr key={product._id} className="border-b border-neutral-200 dark:border-white/10 cursor-pointer hover:bg-pink-300 hover:text-base">
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
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{product?.title}</td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold max-w-96 text-wrap">{product?.description}</td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.category}</td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold">{product?.foodCategory}</td>
                                                <td className="whitespace-nowrap px-6 py-4 font-semibold">₹ {product?.price}</td>
                                                <td className="group whitespace-nowrap px-6 py-4 font-semibold">
                                                    <CiEdit size={25} onClick={() => {
                                                        router.push(`/product/${product?._id}`)
                                                    }} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" />
                                                </td>
                                            </tr>
                                        ))}
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

export default MyProduct;
