export const validateToken = async (token: string): Promise<{ valid: boolean; error?: string }> => {
  try {
    const response = await fetch("https://tavusapi.com/v2/conversations", {
      method: "GET",
      headers: {
        "x-api-key": token,
      },
    });

    if (response.status === 401) {
      const data = await response.json();
      if (data.message === "Invalid access token") {
        return { valid: false, error: "Invalid access token" };
      }
      return { valid: false, error: "Unauthorized" };
    }

    if (!response.ok) {
      return { valid: false, error: `HTTP error! status: ${response.status}` };
    }

    return { valid: true };
  } catch (error) {
    console.error("Token validation error:", error);
    return { valid: false, error: "Network error" };
  }
};