const AdminDetailView = (state = { first:"not working" }, action) => {
    switch (action.type) {
      case "update":
        console.log("in reducer", action.payload);
        state = { first: action.payload };
        break;
    }
    return state;
  };
  
  export default AdminDetailView;
  