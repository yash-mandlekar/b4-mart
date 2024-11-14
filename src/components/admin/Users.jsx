import React, { useState,useEffect } from "react";
import "../../Css/Users.css";
import Axios from "../../Axios";
import { useSelector } from "react-redux";



  const Users = () => {
    const [userdata, setUserdata] = useState([]);
    
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await Axios.get("http://localhost:4000/api/admin/user");
          console.log(response.data);
          setUserdata(response.data); 
        } catch (error) {
          console.error("Cannot fetch data from the backend:", error);
        }
      };
  
      fetchUsers();
    }, []);

  // const users = [
  //   { serial: 1, username: "JohnDoe", contact: "123-456-7890", orders: 5 },
  //   { serial: 2, username: "JaneDoe", contact: "098-765-4321", orders: 3 },
  //   { serial: 3, username: "AliceSmith", contact: "456-123-7890", orders: 8 },
  //   { serial: 4, username: "BobJohnson", contact: "789-123-4567", orders: 2 },
  //   // Add more users as needed
  // ];
  return (
    <div className="userCtr">
      <div className="user-table-container">
        <h1>All Users</h1>
        <table className="user-table">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Username</th>
              <th>Contact No.</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {userdata.map((user,i) => (
              <tr key={user._id}>
                <td>{i+1}</td>
                <td>{user.username}</td>
                <td>{user.contact}</td>
                <td>{user.orders.length}</td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
