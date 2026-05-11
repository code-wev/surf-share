import { apiClient } from "@/lib/api/client";

export const sendContactMessage = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const response = await apiClient.post("/contact", data);
  return response.data;
};
