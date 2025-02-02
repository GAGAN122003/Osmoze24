"use client";
import { useState, useEffect } from "react";
import { signInWithGoogle } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserAuth } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../firebase";
import UserDataService from "../Services/services.js";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Osmose from "../image/osmoze2.png";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import Google from "../image/google.svg";
const SignIn = () => {
  // For Email and Password!
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    email,
    setEmail,
    password,
    setPassword,
    users,
    setUsers,
    currentUserId,
    setCurrentUserId,
  } = UserAuth();

  useEffect(() => {
    const getUser = async () => {
      const data = await UserDataService.getAllUser();
      // console.log(data.docs)
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getUser();
  }, [setUsers]);

  const SignInWithGoogle = async () => {
    try {
      const data = await signInWithPopup(auth, provider);
      const userEmail = data.user.email;
      if (userEmail.endsWith("@itbhu.ac.in")) {
        const userId = users.find((doc) => doc.email === userEmail)?.id || "";
        console.log(data.user);
        console.log(userId);
        setCurrentUserId(userId);
        Cookies.set("User", userId);
        // Check if the user exists in your local list of users
        const userExists =
          users.find((doc) => doc.email === userEmail)?.email || "";

        if (!userExists) {
          // console.log("User not found. Redirecting to signUp page...")
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="mt-1 text-sm text-gray-500">
                      User Not found! Make sure you are registered.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setTimeout(() => {
                      router.push("/signUp");
                    }, 500);
                  }}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none "
                >
                  Close
                </button>
              </div>
            </div>
          ));
          setTimeout(() => {
            router.push("/signUp");
          }, 5000);
        } else {
          router.push("/");
        }
      } else {
        toast.error("Only itbhu.ac.in domain emails are allowed to log in.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSignIn = async () => {
  //   try {
  //     const userEmail = users.some((doc) => doc.email === email);
  //     const userPassword = users.some((doc) => doc.password === password);
  //     const userId = users.find((doc) => doc.email === email)?.id || "";

  //     setCurrentUserId(userId);

  //     if (userEmail && userPassword) {
  //       router.push("/");
  //     } else {
  //       toast.custom((t) => (
  //         <div
  //           className={`${
  //             t.visible ? "animate-enter" : "animate-leave"
  //           } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  //         >
  //           <div className="flex-1 w-0 p-4">
  //             <div className="flex items-start">
  //               <div className="ml-3 flex-1">
  //                 <p className="mt-1 text-sm text-gray-500">
  //                   Invalid Password or You haven&apos;t set a Password!
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="flex border-l border-gray-200">
  //             <button
  //               onClick={() => {
  //                 toast.dismiss(t.id);
  //               }}
  //               className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //             >
  //               Ok
  //             </button>
  //           </div>
  //         </div>
  //       ));
  //     }
  //   } catch (error) {
  //     setError("Error creating account");
  //   }
  //   setEmail("");
  //   setPassword("");
  // };

  //For Google Connect!
  const { user, googleSignIn, logOut } = UserAuth();
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="flex flex-col m-0 min-h-screen">
      <Navbar />
      <main className="flex text-center px-20 mt-5 mb-10 flex-col  items-center justify-center ">
        <div className="w-4/12 mx-auto mt-8 p-8 bg-gray-100 rounded-md ">
          <div className="flex flex-col items-center justify-center">
            <Image src={Osmose} alt="osmoze" width={160} height={160} />
            <h2 className="text-2xl font-bold mb-1 text-black">
              Osmoze&apos;<span className="text-sky-600">24</span>
            </h2>

            <span className="text-black text-xs mb-1">SIGN IN WITH</span>
            <button
              onClick={SignInWithGoogle}
              className="text-black text-sm m-2 flex mb-3 border-2 border-gray-300 rounded-md shadow-md hover:shadow-lg hover:text-blue-600  py-1 px-2"
            >
              <Image
                alt="..."
                className=" mr-1"
                src={Google}
                width={20}
                height={20}
              />
              Google
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignIn;
