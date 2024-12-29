import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/Redux/userSlice";
import { RootState } from "@/Redux/Store";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "@/Components/Header";
import { Productform } from "@/Components/ProductForm";
import { Button } from "@/Components/ui/button";
import DisplayTable from "@/Components/DisplayTable";

// Define the Product type
type Product = {
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
};

// Function to get access token from cookies
const getTokenFromCookies = () => {
  const accessToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  return accessToken;
};

export default function AddProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;

  // Handle Logout
  const handleLogout = () => {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
    dispatch(setUser(null));
    window.location.href = "/login";
  };

  // Fetch User Profile
  useEffect(() => {
    const token = getTokenFromCookies();

    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        { token }, // Send the token in the request body
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.error) {
          toast.error("Failed to fetch user profile.", {
            position: "top-right",
          });
        } else {
          toast.success("User profile fetched successfully!", {
            position: "top-right",
          });
          dispatch(setUser(response.data.user));
        }
      })
      .catch((error) => {
        toast.error("Error fetching user profile.", {
          position: "top-right",
        });
        console.error("Error fetching user profile:", error);
      });
  }, [navigate, dispatch]);

  // Fetch Products for the Logged-in User
  const fetchProducts = async () => {
    console.log(userId)
    if (!userId) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/user/6770c20da6705ec335324cac`
      );
      console.log("response", response)
      const fetchedProducts = response.data.products.map((product: any) => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        totalPrice: product.price * product.quantity,
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.log(error)
      toast.error("Error fetching products.", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProducts();
    }
  }, [userId]);

  // Handle Product Addition
  const handleProductAdded = () => {
    toast.success("Product added successfully!", {
      position: "top-right",
    });
    fetchProducts(); // Re-fetch products when a new one is added
  };

  // Handle Download
  const handleDownload = async () => {
    try {
      if (!userId) {
        toast.error("User ID is required to generate the report.", {
          position: "top-right",
        });
        return;
      }

      // Request to generate PDF
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/generate-products-pdf/${userId}`,
        {
          responseType: "arraybuffer", // Set response type to handle binary data
        }
      );

      // Convert response to Blob and create download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "products-report.pdf"; // Set the file name
      link.click();

      toast.success("PDF generated and downloaded successfully!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Failed to download the PDF report.", {
        position: "top-right",
      });
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header buttonText="Logout" onButtonClick={handleLogout} />
      <div className="p-10 bg-black">
        <Productform onProductAdded={handleProductAdded} />
        <DisplayTable dat={products} />
        <div className="flex justify-center w-full my-10">
          <Button
            onClick={handleDownload}
            className="bg-[#44403c] text-[#a3e635] px-6 py-2 rounded-md"
          >
            Download Pdf Invoice
          </Button>
        </div>
      </div>

      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </div>
  );
}
