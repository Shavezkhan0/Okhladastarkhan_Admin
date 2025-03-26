// src/pages/api/hello.js

export default function handler(req, res) {
  const pincode = {
    110025: { city: "South Delhi", state: "New Delhi", country: "Inda" },
  };

  res.status(200).json(pincode);
}
