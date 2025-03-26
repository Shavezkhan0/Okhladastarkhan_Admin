"use client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import { GoDotFill } from "react-icons/go";

const AllOrders = () => {


    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [shopDataMap, setShopDataMap] = useState({});
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (sessionStatus !== "authenticated") {
            Toastify({
                text: `Login first`,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                style: { background: "linear-gradient(to right, #00b09b, #96c93d)" },
            }).showToast();
            router.push("/login");
            return;
        }

        const getOrders = async () => {
            try {
                const response = await fetch("/api/getAllOrders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({}),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                setOrders(data);

                const shopEmailSet = new Set();
                data?.Orders?.forEach((order) =>
                    order.shopDetails?.forEach((shop) => shopEmailSet.add(shop.shopemail))
                );

                const shopDataResponses = await Promise.all(
                    [...shopEmailSet].map((shopemail) =>
                        fetch("/api/shops/getShopUser", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ email: shopemail }),
                        }).then((res) => res.json())
                    )
                );

                const shopDataMap = shopDataResponses.reduce((acc, shopData, idx) => {
                    const shopemail = [...shopEmailSet][idx];
                    acc[shopemail] = shopData.shopUser;
                    return acc;
                }, {});

                setShopDataMap(shopDataMap);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [sessionStatus, router]);

    console.log(orders)

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='container mx-auto px-4'>
            <h1 className='text-xl font-semibold text-center py-4'>All Orders : {orders?.Orders?.length} </h1>
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs font-light text-surface dark:text-white">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                        <tr>
                            <th className="px-4 py-2">#OrderId</th>
                            <th className="px-4 py-2">User Name</th>
                            <th className="px-4 py-2">User Phone</th>
                            <th className="px-4 py-2">User Landmark</th>
                            <th className="px-4 py-2">User Address</th>
                            <th className="px-4 py-2">Shop Data</th>
                            <th className="px-4 py-2">Total Price</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.Orders?.slice().reverse().map((item) => {
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
                                    className="border-b border-neutral-200 dark:border-white/10 cursor-pointer hover:bg-[#e5a7f4] hover:text-base">
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.orderId}</h1>
                                        <span className="text-xs">Date: {formattedDate}</span><br />
                                        <span className="text-xs">Time: {formattedTime}</span>
                                    </td>
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.username}</h1>
                                    </td>
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.phoneNumber}</h1>
                                    </td>
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.landmark}</h1>
                                    </td>
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.address}</h1>
                                    </td>
                                    <td className="px-4 py-2">
                                        {item?.shopDetails?.map((shop) => {
                                            const shopInfo = shopDataMap[shop.shopemail];
                                            return (
                                                <div key={shop._id} className="mb-2">
                                                    <table className="min-w-full text-left text-xs font-light text-surface dark:text-white">
                                                        <thead>
                                                            <tr>
                                                                <th className="px-2 py-1">Shop Details</th>
                                                                <th className="px-2 py-1">Product Details</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="border px-2 py-1">
                                                                    <h1 className="text-xs">Shop: {shopInfo?.shopUser?.username || "Shop Name"}</h1>
                                                                    <h1 className="text-xs">Number: {shopInfo?.shopUser?.phoneNumber || "Shop Number"}</h1>
                                                                    <h1 className="text-xs">Address: {shopInfo?.shopUser?.address || "Shop Address"}</h1>
                                                                </td>
                                                                <td className="border px-2 py-1">
                                                                    <table className="min-w-full text-left text-xs font-light text-surface dark:text-white">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="px-2 py-1">Product Name</th>
                                                                                <th className="px-2 py-1">Category</th>
                                                                                <th className="px-2 py-1">Price</th>
                                                                                <th className="px-2 py-1">Quantity</th>
                                                                                <th className="px-2 py-1">Product Price</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {shop.products.map((productId) => {
                                                                                const product = item.products.find((p) => p.id === productId);
                                                                                return product ? (
                                                                                    <tr key={product.id}>
                                                                                        <td className="border px-2 py-1">{product.name}</td>
                                                                                        <td className="border px-2 py-1">{product.foodCategory}</td>
                                                                                        <td className="border px-2 py-1">{product.price}</td>
                                                                                        <td className="border px-2 py-1">{product.quantity}</td>
                                                                                        <td className="border px-2 py-1">
                                                                                            {product.price * product.quantity}
                                                                                        </td>
                                                                                    </tr>
                                                                                ) : (
                                                                                    <tr key={productId}>
                                                                                        <td className="border px-2 py-1" colSpan="5">Product data not found.</td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td className="border px-2 py-1">
                                                                    {/* Calculate total price for the shop */}
                                                                    {shop.products.reduce((total, productId) => {
                                                                        const product = item.products.find((p) => p.id === productId);
                                                                        if (product) {
                                                                            return total + (product.price * product.quantity);
                                                                        }
                                                                        return total;
                                                                    }, 0)}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td className="px-4 py-2">
                                        <h1 className="text-sm">{item.amount}</h1>
                                    </td>
                                    <td className="px-4 py-2">
                                        {item?.deliverystatus?.deliver === "pending" ? (
                                            <span className="font-semibold text-blue-700">
                                                {item?.deliverystatus?.deliver}
                                            </span>
                                        ) : item?.deliverystatus?.deliver === "success" ? (
                                            <span className="font-semibold text-green-600">
                                                {item?.deliverystatus?.deliver}
                                            </span>
                                        ) : (
                                            <span className="font-semibold text-red-600">
                                                {item?.deliverystatus?.deliver}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default AllOrders;
