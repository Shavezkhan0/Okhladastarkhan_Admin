"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import LoadingBar from "react-top-loading-bar";
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const Shop = ({ params }) => {

  const { email } = params;
  const decodedEmail = decodeURIComponent(email);

  const [products, setProducts] = useState([]);
  const [shopUser, setshopUser] = useState(null)
  const [Active, setActive] = useState(null)
  const router = useRouter()
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/shops/getShopProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: decodedEmail }),
        });
        const result = await response.json();
        setProducts(result.products);

      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProducts();


    const getShopUser = async () => {
      try {
        const res = await fetch("/api/shops/getShopUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: decodedEmail }),
        });
        const response = await res.json();
        setshopUser(response.shopUser.shopUser);
        setActive(response.shopUser.shopUser.active)


      } catch (error) {
        console.error("Error fetching product:", error);
      }

    }
    getShopUser()
  }, [decodedEmail]);


  const handlechangeOn = async () => {
    setProgress(20);
    try {
      const res = await fetch("/api/shops/onshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: decodedEmail }),
      });
      const response = await res.json();

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
      setProgress(50);
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    const onProduct = async () => {
      const res = await fetch("/api/onproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: decodedEmail }),
      });
    };
    setProgress(60);
    await onProduct();
    setProgress(100);
  };

  const handlechangeOff = async () => {
    setProgress(20);
    try {
      const res = await fetch("/api/shops/offshop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: decodedEmail }),
      });
      const response = await res.json();

      if (response.success === true) {
        Toastify({
          text: `${response.message}`,
          duration: 3000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          style: { background: "linear-gradient(to right, #ff0000, #990000)" },
        }).showToast();
      }
      setProgress(50);
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    const offProduct = async () => {
      const res = await fetch("/api/offproducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: decodedEmail }),
      });
    };
    setProgress(60);
    await offProduct();
    setProgress(100);
  };


  const handlechangeActive = async () => {
    setProgress(10);
    const shopActive = async () => {
      try {
        const res = await fetch("/api/shops/activeShop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const response = await res.json();
        setProgress(40);
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
        console.error("Error submitting form:", error);
      }
    }

    const shopActiveProducts = async () => {
      try {
        const res = await fetch("/api/shops/activeShopProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const response = await res.json();
        setProgress(80);
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
        setProgress(100);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    await shopActive()
    setProgress(50);
    await shopActiveProducts()
    setProgress(100);
  }

  const handlechangeDeactive = async () => {

    setProgress(10);
    const shopDeactive = async () => {
      try {
        const res = await fetch("/api/shops/deactiveShop", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const response = await res.json();
        setProgress(40);
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
        setProgress(100);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }

    const shopDeactiveProducts = async () => {
      setProgress(50);
      try {
        const res = await fetch("/api/shops/deactiveShopProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
        const response = await res.json();
        setProgress(80);
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
        setProgress(100);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }




    await shopDeactive()
    setProgress(50);
    await shopDeactiveProducts()
    setProgress(100);
  }



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
      <section className="text-gray-600 body-font items-center">

        <div className='flex justify-between '>

          <div>
            <ul className='flex md:gap-5 gap-3 md:py-2 px-5 rounded-sm mx-5 bg-gray-200 flex-wrap font-semibold md:font-bold md:text-base items-center'>
              <div onClick={() => router.push(`/orders/${decodedEmail}`)} className='cursor-pointer hover:text-xl hover:text-[#c545ec]' ><li>Orders</li></div>
            </ul>
          </div>


          <div className="flex justify-end w-fit md:w-[10vw] pr-3">
            <div className="w-fit border-[2px] rounded-md border-gray-400">
              <button
                onClick={() => handlechangeOn()}
                className={` ${shopUser?.shop === "on" && "bg-green-400"
                  } hover:bg-green-600  text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
              >
                On
              </button>
              <button
                onClick={() => handlechangeOff()}
                className={` ${shopUser?.shop !== "on" && "bg-red-400"
                  } hover:bg-red-600 text-black font-semibold rounded-r-sm px-3  py-2 w-30`}
              >
                Off
              </button>
            </div>
          </div>
          <div className="flex justify-end w-fit md:w-[10vw] pr-3">
            <div className="w-fit flex border-[2px] rounded-md border-gray-400">
              <button
                onClick={() => handlechangeActive()}
                className={` ${Active === "true" && "bg-green-400"
                  } hover:bg-green-600  text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
              >
                Active
              </button>
              <button
                onClick={() => handlechangeDeactive()}
                className={` ${Active === "false" && "bg-red-400"
                  } hover:bg-red-600 text-black font-semibold rounded-l-sm px-3  py-2 w-30`}
              >
                Deactive
              </button>
            </div>
          </div>
        </div>



        <div className="flex  items-center md:flex-row flex-col gap-5 justify-between  m-2 shadow-gray-300 shadow-md  p-2 rounded-sm  ">

          <div className="flex flex-wrap md:w-52 items-start justify-start gap-x-2 gap-y-1 shadow-gray-300 shadow-md  p-2 rounded-sm">
            <div className=' w-full  text-end'>
              {
                shopUser?.shop === "on" ? (
                  <span className='border-2 border-gray-400 p-[2px] bg-green-500 text-white'>On</span>
                ) : (
                  <span className='border-2 border-gray-400 p-[2px] bg-red-500 text-white'>Off</span>

                )
              }
            </div>
            <div className="block  w-full relative items-center justify-center  rounded overflow-hidden">
              <Image alt="ecommerce" src={shopUser?.image[0]?.secure_url} className="cursor-pointer object-cover md:w-48 w-[90vw] h-[30vh] md:h-36"
                width={150}
                height={150} />
            </div>
            <div className='items-start w-full '>
              <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font ">Name: </span>{shopUser?.username}</div>
              <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font ">ShopType: </span>{shopUser?.shopType}</div>
            </div>
          </div >


          <div className="flex md:w-1/2 w-full flex-col items-start justify-start text-start md:text-end  shadow-gray-300 shadow-md md:py-2 md:px-3 px-1 py-1 rounded-sm">



            <h3 className="text-gray-500 font-semibold text-start text-lg tracking-widest title-font mb-1">Shop Address :</h3>
            <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font mb-1">Address: </span>{shopUser?.address}</div>
            <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font mb-1">Landmark: </span>{shopUser?.landmark}</div>
            <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font mb-1">City: </span>{shopUser?.city}</div>
            <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font mb-1">Pincode: </span>{shopUser?.pincode}</div>
            <div ><span className="text-gray-500 font-semibold text-start text-base tracking-widest title-font mb-1">State: </span>{shopUser?.state}</div>
          </div>
        </div>


        <div className="container pl-2 pr-0 py-5 mx-auto ">

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ">


            {
              products?.length > 0 ? (<>
                {
                  products?.map((product) => {
                    return (
                      <div key={product?._id} onClick={() => {
                        setProgress(100)
                        router.push(`/product/${product._id}`)
                      }}
                        className="cursor-pointer flex flex-col  justify-center  w-[80vw]  lg:w-1/6 md:w-1/3 shadow-md shadow-gray-500 p-2 mx-2 my-3">
                        <div className='flex justify-between py-1 items-center'>
                          <div>
                            {/* <span className='font-semibold'>Shop : </span>
                            <span> {product.shopname}</span> */}
                          </div>
                          <div>
                            {
                              product.shop === "on" ? (
                                <span className='border-2 border-gray-400 p-[2px] bg-green-500 text-white'>On</span>
                              ) : (
                                <span className='border-2 border-gray-400 p-[2px] bg-red-500 text-white'>Off</span>

                              )
                            }
                          </div>
                        </div>
                        <div className="block relative items-center justify-center mx-auto rounded overflow-hidden">
                          <Image alt="ecommerce" src={product?.image[0]?.secure_url} className="cursor-pointer object-cover md:w-48 w-[70vw] h-[20vh] md:h-36"
                            width={200}
                            height={200} />
                        </div>
                        <div className="mt-2 flex flex-start flex-col">
                          <h3 className="text-gray-500 font-semibold text-start text-lg tracking-widest title-font mb-1">{product?.title}</h3>
                          <h3 className="text-gray-500 font-normal text-start text-base tracking-widest title-font">{product?.foodCategory}</h3>
                          <p className="mt-1 text-green-400">
                            <span>&#8377;</span>{product?.price}
                          </p>
                        </div>
                      </div>

                    )
                  })
                }
              </>) : (<>
                <div>
                  <h1>Product is not available</h1>
                </div>
              </>)
            }



          </div>
        </div>
      </section>
    </div>
  )
}



export default Shop