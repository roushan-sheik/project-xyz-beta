"use client";

import { useUsers } from "@/hooks/admin/useUsers";
import React from "react";

const Users: React.FC = () => {
  const { data: users, isLoading, isError, error } = useUsers();

  if (isLoading) {
    return <p className="text-center text-gray-500">読み込み中...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-500">
        エラー: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users?.map((user) => (
        <div
          key={user.id}
          className="p-4 border rounded-lg shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
