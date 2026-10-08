
import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);

  // Save User
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://140.245.237.16:9000/users",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name,
            age: Number(age),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Backend error:", data);
        return;
      }

      console.log("Backend response:", data);

      alert("User saved successfully!");

      // Clear input fields
      setName("");
      setAge("");

    } catch (error) {
      console.log("Connection error:", error);

      alert("Could not connect to backend");
    }
  };

  // Get Users
  const handleGetUsers = async () => {
    try {
      const response = await fetch(
        "http://140.245.237.16:9000/users"
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Backend error:", data);
        return;
      }

      console.log("Users:", data);

      setUsers(data);

    } catch (error) {
      console.log("Connection error:", error);

      alert("Could not connect to backend");
    }
  };

  return (
    <div className="app">

      <div className="container">

        <h1>User Management</h1>

        {/* Save User Form */}

        <form
          onSubmit={handleSubmit}
          className="user-form"
        >

          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="number"
            placeholder="Enter age"
            value={age}
            onChange={(e) =>
              setAge(e.target.value)
            }
            required
          />

          <button
            type="submit"
            className="save-btn"
          >
            Save User
          </button>

        </form>

        {/* Get Users Button */}

        <button
          type="button"
          className="get-btn"
          onClick={handleGetUsers}
        >
          Get Users
        </button>

        {/* Users Table */}

        <div className="table-section">

          <h2>Saved Users</h2>

          {users.length === 0 ? (

            <p className="no-data">
              No users found. Click "Get Users".
            </p>

          ) : (

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td>
                      {user.name}
                    </td>

                    <td>
                      {user.age}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  );
}

export default App;

