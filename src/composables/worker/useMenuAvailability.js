import axios from "axios";

export function useMenuAvailability() {

  async function setAvailable(item, availability) {
    let res; 
    res = await axios.put(
      `http://localhost:8088/worker/menu-items/${item.id}/availability`,
      null,
      {
        params: { availability },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }
    );
    item.availability = availability;
  }

  function invalidate(item) {
    return setAvailable(item, false);
  }

  function validate(item) {
    return setAvailable(item, true);
  }

  return { invalidate, validate };
}
