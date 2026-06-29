import API from "./api";
export const eventService = {
  getEvents: async (flatId) => {
    const res = await API.get(`/events/${flatId}`);
    return res.data;
  }
};