"use client";
import { Employee } from "@prisma/client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function EmployeePage() {
  const employeesData = api.employee.list.useQuery();

  return (
    <div className="container mx-auto my-8">
      <h1 className="mb-4 text-3xl font-bold">Employee Details</h1>
      <p className="mb-4">
        Looking to create?{" "}
        <a href="/employee/new" className="text-blue-500">
          Click here!
        </a>
      </p>

      {/* Display employee details in a table */}
      <table className="min-w-full border border-gray-300 bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Mobile</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Updated At</th>
          </tr>
        </thead>
        <tbody>
          {employeesData?.data?.map((employee) => (
            <tr key={employee.id} className="border-t border-gray-300">
              <td className="px-4 py-2">{employee.id}</td>
              <td className="px-4 py-2">{employee.name}</td>
              <td className="px-4 py-2">{employee.email}</td>
              <td className="px-4 py-2">{employee.mobile || "N/A"}</td>
              <td className="px-4 py-2">{employee.department}</td>
              <td className="px-4 py-2">
                {" "}
                {new Date(employee.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {" "}
                {new Date(employee.updatedAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
