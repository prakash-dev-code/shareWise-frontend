"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Montserrat } from "next/font/google";
import BackTop from "antd/es/float-button/BackTop";
import Loader from "@/shared/loader";
import toast, { Toaster } from "react-hot-toast";
import { Button, Modal } from "antd";
import { FaRegArrowAltCircleUp } from "react-icons/fa";
import { child } from "@/types/common";

const montserratConfig = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const PUBLIC_ROUTES = ["/", "/signup"];

const ChildLayout: React.FC<child> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return !!token;
    }
    return false;
  };

  useEffect(() => {
    const tokenExists = checkAuthToken();
    setIsAuthenticated(tokenExists);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return; // Wait for loading to finish

    const tokenExists = checkAuthToken();
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute = pathname.startsWith("/articles");

    if (tokenExists && isPublicRoute) {
      router.replace("/articles");
    } else if (!tokenExists && isProtectedRoute) {
      router.replace("/");
    }
  }, [pathname, loading, router]);

  const handleLogout = async () => {
    router.push("/");
    // await logout();
    localStorage.clear();
    setIsAuthenticated(false);
    toast.success("Logout successful");
    setIsModalOpen(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="max-w-[1920px] m-auto flex flex-col min-h-screen h-full">
        <div className="text-center pt-4">
          <h1 className="text-4xl font-semibold">ShareWise</h1>
          <p className="text-sm font-normal mt-1">
            Knowledge Sharing Platform with AI Summarization
          </p>
        </div>

        {isAuthenticated && (
          <div className="w-full flex justify-end pr-4">
            <Button onClick={() => setIsModalOpen(true)}>Logout</Button>
          </div>
        )}

        <main className={`overflow-hidden ${montserratConfig.className}`}>
          {children}
        </main>

        <BackTop
          style={{ bottom: "5.5rem", right: "1rem" }}
          icon={<FaRegArrowAltCircleUp />}
        />

        <div className="text-center mt-auto pt-2 text-sm font-normal ">
          © {new Date().getFullYear()} Webs Optimization Software Solution.
        </div>

        <Toaster reverseOrder={false} position="top-center" />
      </div>

      <Modal
        title={<div className="text-xl font-semibold">Logout</div>}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        centered
        zIndex={1000}
        footer={
          <div className="flex justify-end">
            <Button className="border" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-500 text-white ml-4"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        }
        className="custom-modal"
      >
        <div className="text-left mt-3 mb-4">
          <span className="text-sm sm:text-base font-normal">
            Are you sure you want to logout?
          </span>
        </div>
      </Modal>
    </>
  );
};

export default ChildLayout;
