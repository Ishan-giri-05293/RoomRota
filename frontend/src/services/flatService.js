import API from "./api";

export const flatService = {
  create: async (flatName) => {
    const res = await API.post("/flat/create", { flatName });
    return res.data;
  },

  join: async (inviteCode) => {
    const res = await API.post("/flat/join", { inviteCode });
    return res.data;
  },

  leave: async () => {
    const res = await API.post("/flat/leave");
    return res.data;
  },

  getDetails: async (flatId) => {
    const res = await API.get(`/flat/${flatId}`);
    return res.data;
  },

  getLeaderboard: async (flatId) => {
    const res = await API.get(`/flat/leaderboard/${flatId}`);
    return res.data;
  },
};