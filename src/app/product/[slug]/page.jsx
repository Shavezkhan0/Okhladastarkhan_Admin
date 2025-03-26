"use client";


import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import LoadingBar from "react-top-loading-bar";
import { CiEdit } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { MdDeleteOutline } from "react-icons/md";

const ProductPage = ({ params }) => {
    const { slug } = params;
    const [product, setProduct] = useState(null);
    const [progress, setProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [editProduct, seteditProduct] = useState(false)
    const { data: session, status: sessionStatus } = useSession();
    const [mainImage, setMainImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [secondImagePreview, setSecondImagePreview] = useState(null);
    const [thirdImagePreview, setThirdImagePreview] = useState(null);
    let allImage;

    const email = session?.user?.email;
    const shopType = session?.user?.shopType;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm();

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


        const getProduct = async () => {
            try {
                const response = await fetch("/api/getproduct", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ slug }),
                });
                const result = await response.json();
                setProduct(result);

                // Set form values and image previews once the product is fetched
                setValue("title", result.title);
                setValue("email", result.email);
                setValue("description", result.description);
                setValue("category", result.category);
                setValue("foodCategory", result.foodCategory);
                setValue("shopType", result.shopType);
                setValue("price", result.price);
                setMainImagePreview(result?.image[0]?.secure_url);
                setSecondImagePreview(result?.image[1]?.secure_url);
                setThirdImagePreview(result?.image[2]?.secure_url);
                if (shopType === "food") {
                    setValue("availability", "unlimited");
                } else {
                    setValue("availability", result.availability);
                }



            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        getProduct();


    }, [slug, sessionStatus,  shopType,setValue]);




    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % product.image.length);
    };

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + product.image.length) % product.image.length);
    };



    const onSubmit = async (data) => {


        const formData = new FormData();
        if (mainImage) formData.append('files', mainImage);
        if (secondImage) formData.append('files', secondImage);
        if (thirdImage) formData.append('files', thirdImage);


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


        const deleteAllImage = async () => {
            if (product?.image[0]?.public_id) {
                await deleteImage(product?.image[0]?.public_id)
            }
            if (product?.image[1]?.public_id) {
                await deleteImage(product?.image[1]?.public_id)
            }
            if (product?.image[2]?.public_id) {
                await deleteImage(product?.image[2]?.public_id)
            }

        }
        await deleteAllImage()

        const uploadImages = async () => {
            const response = await axios.post('/api/upload/uploadProductImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const image = {
                image: response.data.image.map(img => ({
                    public_id: img.public_id,
                    secure_url: img.secure_url
                }))
            };

            allImage = image
        }
        await uploadImages()

        data = await { ...data, _id: slug, image: allImage };


        try {
            const res = await fetch("/api/updateproduct", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const response = await res.json()

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


        } catch (error) {
            console.error('Error submitting form:', error)
        }


    };

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

    const deleteProduct = async () => {

        setProgress(20);
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

        const deleteAllImage = async () => {
            if (product?.image[0]?.public_id) {
                await deleteImage(product?.image[0]?.public_id)
            }
            if (product?.image[1]?.public_id) {
                await deleteImage(product?.image[1]?.public_id)
            }
            if (product?.image[2]?.public_id) {
                await deleteImage(product?.image[2]?.public_id)
            }

        }
        await deleteAllImage()
        setProgress(40);
        const deleteProductFromDataBase = async () => {
            try {
                const res = await fetch("/api/deleteproduct", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(product._id),
                })
                const response = await res.json()

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



            } catch (error) {
                console.error('Error deleting product:', error);
            }

        }
        await deleteProductFromDataBase()
        setProgress(100);

    }


    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <LoadingBar
                    color="#f11946"
                    progress={progress}
                    waitingTime={3000}
                    onLoaderFinished={() => {
                        console.log("Loader finished"); // Debugging statement
                        setProgress(0);
                    }}
                />
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <div id="gallery" className="relative w-full md:w-[30vw]" data-carousel="slide">
                            <div className="relative h-56 overflow-hidden rounded-lg shadow-md shadow-[#ce77eb] md:h-96">



                                {product?.image.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === activeIndex ? 'opacity-100' : 'opacity-0'
                                            }`}
                                        data-carousel-item
                                    >
                                        <Image
                                            alt="ecommerce"
                                            className="shadow-lg shadow-[#da82f7] p-2 "
                                            src={image?.secure_url}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                                data-carousel-prev
                                onClick={handlePrev}
                            >
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                    <svg
                                        className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 1 1 5l4 4"
                                        />
                                    </svg>
                                    <span className="sr-only">Previous</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                                data-carousel-next
                                onClick={handleNext}
                            >
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                                    <svg
                                        className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 6 10"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 9 4-4-4-4"
                                        />
                                    </svg>
                                    <span className="sr-only">Next</span>
                                </span>
                            </button>
                        </div>

                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <div className="py-1">
                                <span className="font-bold text-3xl">Title: </span>
                                <span className="font-semibold text-2xl">{product?.title}</span>
                            </div>
                            <div className="py-1">
                                <span className="font-bold text-lg">Description: </span>
                                <span className="font-medium text-base">{product?.description}</span>
                            </div>
                            <div className="py-1">
                                <span className="font-bold text-lg">Food category: </span>
                                <span className="font-medium text-base">{product?.foodCategory}</span>
                            </div>
                            <div className="py-1">
                                <span className="font-bold text-lg">Category: </span>
                                <span className="font-medium text-base">{product?.category}</span>
                            </div>
                            <div className="py-1">
                                <span className="font-bold text-lg">Price: ₹ </span>
                                <span className="font-medium text-base">{product?.price}</span>
                            </div>
                            <div className=' flex justify-between pr-10'>
                                <button onClick={() => seteditProduct(true)} className="disabled:bg-[#e3b4f2] group  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-[#d48feb] border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-[#c743f3] rounded text-sm md:text-base cursor-pointer">Product<CiEdit size={25} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /></button>
                                <button onClick={() => deleteProduct()} className="disabled:bg-[#e3b4f2] group  w-42 text-center mt-2 flex justify-center items-center gap-1 font-semibold text-black bg-red-500 border-0 py-2 px-3 md:px-6 focus:outline-none hover:bg-red-700 rounded text-sm md:text-base cursor-pointer">Delete<MdDeleteOutline size={23} className="group-hover:scale-125 transition-transform duration-200 cursor-pointer" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                editProduct && <div className='absolute top-0  z-20 bg-white opacity-90 min-h-screen w-[100vw]'>
                    <div className='flex justify-end'><IoMdClose className='cursor-pointer mr-5 my-3' size={40} onClick={() => seteditProduct(false)} /></div>
                    <div className='pb-10'>


                        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2 px-4'>
                            <div className='w-[80vw] mx-auto'>
                                <h2 className='font-semibold'>1. Product Details</h2>
                                <div className='py-2'>
                                    <div className='flex flex-col gap-2 px-4'>
                                        <div className='w-full flex flex-row'>
                                            <div className='flex w-full flex-row justify-between'>
                                                <label className='w-fit'>Product Name</label>
                                                <div className='w-[60vw]'>
                                                    <input type="text" className='bg-gray-200 w-full bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter your first name' {...register("title", { required: true })} />
                                                    {errors.title && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2'>
                                            <div className='w-full flex items-center justify-between'>
                                                <label className=''>Price in Rupees ₹</label>
                                                <div className='flex flex-col'>
                                                    <input type="number" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Price' {...register("price", { required: true })} />
                                                    {errors.price && <div className='text-xs text-red-500'>This field is required</div>}
                                                </div>
                                            </div>
                                            <div className='w-full flex items-center justify-between'>
                                                <label className=''>Quantity</label>
                                                <div className='flex flex-col'>
                                                    <input type="text" className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1' placeholder='Enter Quantity' {...register("availability", {
                                                        required: "This field is required",
                                                    })} />
                                                    {errors.availablety && <div className='text-xs text-red-500'>{errors.availablety.message}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex gap-2 justify-between'>
                                            <label className=''>Description</label>
                                            <div className='flex w-[60vw]'>
                                                <textarea type="text" rows={2} className='bg-gray-200 bottom-2 w-full border-black rounded-sm px-2 py-1' placeholder='Enter description' {...register("description", { required: true })} />
                                                {errors.description && <div className='text-xs text-red-500'>This field is required</div>}
                                            </div>
                                        </div>
                                        <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2'>
                                            <div className='w-full flex items-center justify-between'>
                                                <label className=''>Food Category</label>
                                                <div className='flex flex-col'>
                                                    <select className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'  {...register("foodCategory", { required: true })} defaultValue={"food"}>
                                                        <option value="nonVeg">Non Veg</option>
                                                        <option value="Veg">Veg</option>
                                                    </select>
                                                    {errors.foodCategory && <div className='text-xs text-red-500'>{errors.foodCategory.message}</div>}
                                                </div>
                                            </div>
                                            <div className='w-full flex items-center justify-between'>
                                                <label className=''>Category</label>
                                                <div className='flex flex-col'>
                                                    <select className='bg-gray-200 bottom-2 border-black rounded-sm px-2 py-1'  {...register("category", { required: true })} defaultValue={"food"}>
                                                        <option value="chickenbiryani">Chicken Biryani</option>
                                                        <option value="bardebiryani">Bardi ki Biryani</option>
                                                        <option value="chickenkorma">Chicken korma</option>
                                                        <option value="bardekorma">Bardi ki korma</option>
                                                        <option value="nihari">Nihari</option>
                                                    </select>
                                                    {errors.category && <div className='text-xs text-red-500'>{errors.category.message}</div>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2 pt-5'>Upload Images</div>


                                        <div className='flex flex-col md:flex-row items-center md:gap-10 gap-2'>
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="mainImage" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                    {mainImagePreview ? (
                                                        <Image src={mainImagePreview} alt="Main Preview" layout="fill" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                    )}
                                                    <input id="mainImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setMainImage, setMainImagePreview)} />
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="secondImage" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                    {secondImagePreview ? (
                                                        <Image src={secondImagePreview} alt="Second Preview" layout="fill" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                    )}
                                                    <input id="secondImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setSecondImage, setSecondImagePreview)} />
                                                </label>
                                            </div>
                                            <div className="flex items-center justify-center w-full">
                                                <label htmlFor="thirdImage" className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                                    {thirdImagePreview ? (
                                                        <Image src={thirdImagePreview} alt="Third Preview" layout="fill" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                            </svg>
                                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                        </div>
                                                    )}
                                                    <input id="thirdImage" type="file" className="hidden" accept="image/*" onChange={(e) => handleImageChange(e, setThirdImage, setThirdImagePreview)} />
                                                </label>
                                            </div>
                                        </div>




                                        <div className='text-center'>
                                            <button type='submit' disabled={isSubmitting} className='bg-pink-500 disabled:bg-pink-200 text-white font-semibold rounded-sm px-3 py-2 mt-4 w-full'>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form >

                    </div>
                </div>
            }
        </>
    );
};

export default ProductPage;
