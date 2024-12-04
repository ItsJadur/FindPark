import axios from "axios";

const NATIONAL_PARK_API_BASE_URL = "https://developer.nps.gov/api/v1";
const API_KEY = "MfoLylQ1lKC4bTqS7cXHYbse3k4ZPWeOZFQABHEI";

export const fetchParks = async (stateCode) => {
  try {
    const response = await axios.get(`${NATIONAL_PARK_API_BASE_URL}/parks`, {
      params: {
        stateCode: stateCode, 
        limit: 10,            
        api_key: API_KEY,
      },
    });
    return response.data.data;
  } catch (e) {
    console.log("Error fetching parks:", e);
    throw e;
  }
};