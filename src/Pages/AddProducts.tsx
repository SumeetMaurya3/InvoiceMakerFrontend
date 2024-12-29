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

// Function to get access token from localStorage
const getTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token');
};

export default function AddProducts() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?._id;

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(setUser(null));
    navigate("/login");
  };

  // Fetch User Profile
  useEffect(() => {
    const token = getTokenFromLocalStorage();

    if (!token) {
      return;
    }

    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/user/profile`,
        { token }, // Send the token in the request body
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
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
    if (!userId) return;

    const token = getTokenFromLocalStorage();
    if (!token) {
      toast.error("Access token missing. Please login again.", {
        position: "top-right",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/user/products`,
        { user_id: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const fetchedProducts = response.data.products.map((product: any) => ({
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        totalPrice: product.price * product.quantity,
      }));
      setProducts(fetchedProducts);
    } catch (error) {
      console.log(error);
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

      const token = getTokenFromLocalStorage();
      if (!token) {
        toast.error("Access token missing. Please login again.", {
          position: "top-right",
        });
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/generate-products-pdf`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "products-report.pdf";
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

  const token = getTokenFromLocalStorage();

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <Header
        buttonText={token ? "Logout" : "Login"}
        onButtonClick={token ? handleLogout : () => navigate("/login")}
      />
      <div className="p-10 bg-black">
        {token ? (
          <>
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
          </>
        ) : (
          <div className="text-center mt-10">
            <p>Please login to create the invoice.</p>
          </div>
        )}
      </div>

      {/* Toast Container for displaying notifications */}
      <ToastContainer />
    </div>
  );
}
