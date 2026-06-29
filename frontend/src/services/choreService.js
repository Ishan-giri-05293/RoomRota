import API from "./api";

export const choreService = {
  getAll: async (flatId) => {
    const res = await API.get(`/chore/${flatId}`);
    return res.data;
  },
  add: async (choreData) => {
    const res = await API.post("/chore/add", choreData);
    return res.data;
  },
  complete: async (choreId) => {
    const res = await API.patch(`/chore/complete/${choreId}`);
    return res.data;
  },
  autoAssign: async (choreData) => {
    const res = await API.post("/chore/auto-assign", choreData);
    return res.data;
  },
  delete: async (choreId) => {
    const res = await API.delete(`/chore/${choreId}`);
    return res.data;
  },
  update: async (choreId, data) => {
    const res = await API.patch(`/chore/${choreId}`, data);
    return res.data;
  },
    undo: async (choreId) => {
    const res = await API.patch(`/chore/undo/${choreId}`);
    return res.data;
  }
};