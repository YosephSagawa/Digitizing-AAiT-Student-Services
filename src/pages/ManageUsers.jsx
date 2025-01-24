import React, { useState, useEffect } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock users data
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        role: "Student",
        email: "john.doe@example.com",
      },
      {
        id: 2,
        name: "Jane Smith",
        role: "Lecturer",
        email: "jane.smith@example.com",
      },
      {
        id: 3,
        name: "Alice Johnson",
        role: "Proctor",
        email: "alice.johnson@example.com",
      },
      {
        id: 4,
        name: "Bob Brown",
        role: "Student",
        email: "bob.brown@example.com",
      },
      {
        id: 5,
        name: "Charlie White",
        role: "Lecturer",
        email: "charlie.white@example.com",
      },
    ];

    setUsers(mockUsers);
    setLoading(false);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Manage Users</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded mb-4 w-full sm:w-1/3"
      />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border">
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageUsers;
