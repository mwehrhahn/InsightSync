import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export async function login(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

  return res.data;  // access_token, token_type
}
