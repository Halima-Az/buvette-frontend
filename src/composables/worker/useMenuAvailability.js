import axios from "axios";

export function useMenuAvailability() {

  async function setAvailable(item, available) {
    axios.put(
      `http://localhost:8088/worker/menu-items/${item.id}/availability`,
      null,
      {
        params: { available },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );


    item.available = available;
  }

  function invalidate(item) {
    return setAvailable(item, false);
  }

  function validate(item) {
    return setAvailable(item, true);
  }

  return { invalidate, validate };
}
