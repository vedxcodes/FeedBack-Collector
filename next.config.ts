import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    MONGO_URL:"mongodb+srv://sarthakjazz8:DKYDyRz6DeEPJVHb@cluster-1.qfxfo.mongodb.net/project_3_next?retryWrites=true&w=majority&appName=Cluster-1",
    TOKEN_SECRET:"secret",
    DOMAIN:"http://localhost:3000",
    RESEND_API_KEY:"re_T5yPHRrH_PXwQFBTB7XDNjx2KDNS7qugu",
    NEXT_AUTH:"cat",
    NEXTAUTH_SECRET:"CAT",
    apiKey: "AIzaSyAJvsfOJfNBuDh4S4JedmEUiNRTzHKMHII"
  },
}
 
export default nextConfig;
