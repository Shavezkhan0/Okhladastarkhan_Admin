"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/navigation";

export default function Home() {
  const [On, setOn] = useState();
  const { data: session, status: sessionStatus } = useSession();
  const [Products, setProducts] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  let Product_id;

  const email = session?.user?.email;
  const shopType = session?.user?.shopType;
  const router = useRouter();
  const [activeDrop, setactiveDrop] = useState(false);

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
      router.push("/login");
    }

    const getProducts = async () => {
      try {
        const response = await fetch("/api/getAllProducts", {
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
        setProducts(data);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [email, router, sessionStatus]);


 

  return (
    <>
      <LoadingBar
        color="#f11946"
        progress={progress}
        waitingTime={2000}
        onLoaderFinished={() => {
          console.log("Loader finished");
          setProgress(0);
        }}
      />
      <main>
        <div className="py-2 min-h-screen">
          <div className="flex   flex-col-reverse md:flex-row justify-between"></div>

          <div className="border-gray-200 mt-2 pt-2 border-t-2 ">
            <div className=" flex  justify-center items-center">
              <h1 className=" font-semibold  text-2xl">All Product : {Products?.length}</h1>
            </div>
            <section className="text-gray-600 body-font items-center">
              <div className="container pl-2 pr-0 py-5 mx-auto ">
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 ">
                  {Products ? (
                    <>
                      {Products.map((product) => {
                        return (
                          <div
                            key={product?._id}
                            className="cursor-pointer flex flex-col  justify-center  w-[80vw]  lg:w-1/6 md:w-1/3 shadow-md shadow-gray-500 p-2 mx-2 my-3"
                          >
                            <div className="flex justify-between py-1 items-center">
                              <div></div>

                              <div className="flex justify-end  ">
                                <div className="w-fit border-[2px] rounded-md border-gray-400">
                                  <button
                                    onClick={() => {
                                      Product_id = product?._id;
                                      handlechangeProductOn();
                                    }}
                                    className={` ${
                                      product?.shop === "on" && "bg-green-400"
                                    } hover:bg-green-600  text-black font-semibold rounded-l-sm px-1  py-1 w-10`}
                                  >
                                    On
                                  </button>
                                  <button
                                    onClick={() => {
                                      Product_id = product?._id;
                                      handlechangeOffProduct();
                                    }}
                                    className={` ${
                                      product?.shop === "off" && "bg-red-400"
                                    } hover:bg-red-600 text-black font-semibold rounded-r-sm px-1  py-1 w-10`}
                                  >
                                    Off
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="block relative items-center justify-center mx-auto rounded overflow-hidden">
                              <Image
                                alt="ecommerce"
                                src={product?.image[0]?.secure_url}
                                className="cursor-pointer object-cover md:w-48 w-[70vw] h-[20vh] md:h-36"
                                width={200}
                                height={200}
                              />
                            </div>
                            <div className="mt-2 flex flex-start flex-col">
                              <h3 className="text-gray-500 font-semibold text-start text-lg tracking-widest title-font mb-1">
                                {product?.title}
                              </h3>

                              <p className="mt-1 text-green-400">
                                ₹{product?.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div>
                        <h1>Product not available</h1>
                      </div>
                    </>
                  )}
                </div>
              </div>
             
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
