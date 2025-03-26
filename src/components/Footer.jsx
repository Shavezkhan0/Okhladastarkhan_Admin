import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-2 mx-auto flex md:items-center lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
              <Image src={"/logo.png"} height={50} width={130} alt='logo' className='cursor-pointer relative top-0 left-0-0 h-10 w-20 md:h-16 md:w-40' />
            </a>
            <h1 className='mt-2 text-sm text-gray-700'>About Us</h1>
            <p className="mt-1 text-sm text-gray-500">Order Your Food from your</p>
            <p className="mt-1 text-sm text-gray-500">Okhala favorite shop</p>
          </div>
          <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Food Items</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Biryani</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Nihari</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Roll</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Pizza</a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Contact Us</h2>
              <nav className="list-none mb-10">
                <li>
                  <a href="tel:9311148483" className="text-gray-600 hover:text-gray-800">9311148483</a>
                </li>
                <li>
                  <a href="tel:8447184092" className="text-gray-600 hover:text-gray-800">8447184092</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">okhladastarkhan@gmail.com</a>
                </li>

              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest md:px-2 text-sm mb-3">Customer Policy</h2>
              <nav className="list-none mb-10 md:px-2">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Terms of Use</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Security</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Hygiene</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Saftey</a>
                </li>
              </nav>
            </div>
            <div className="lg:w-1/4 md:w-1/2 w-full px-4">
              <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Partners With Us</h2>
              <nav className="list-none mb-10">
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Javad Nihari</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Shafiq Qureshi Chicken Corner</a>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-gray-800">Hyderabadi Biryani</a>
                </li>
              </nav>
            </div>
          </div>
        </div>
        <div className="bg-gray-100">
          <div className="mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
            <p className="text-gray-500 text-sm text-center sm:text-left">Â© 2024 okhladastarkhan.in -- All rights reserved
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
              <a className="text-gray-500">
                <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a className="ml-3 text-gray-500" href="https://www.instagram.com/okhladastarkhan?igsh=NzJpdmYyYTIyY2l0" rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                </svg>
              </a>                          
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer