"use client";
import { api } from "~/trpc/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function EmployeePage() {
  const router = useRouter();
  const employeesData = api.employee.list.useQuery();
  const utils = api.useUtils();

  const fakerEmployee = api.employee.faker.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
    },
  });

  const deleteEmployee = api.employee.delete.useMutation({
    onSuccess: () => {
      utils.employee.list.invalidate();
    },
  });

  return (
    <div className="container mx-auto my-8">
      <h1 className="mb-4 text-3xl font-bold">Employee Details</h1>
      <p className="mb-4">
        Looking to create?{" "}
        <a href="/employee/new" className="text-blue-500">
          Click here!
        </a>
      </p>
      <p className="mb-4">
        Generate a fake one?{" "}
        <button
          className="text-blue-500"
          onClick={() => {
            fakerEmployee.mutate();
          }}
        >
          Click here!
        </button>
      </p>

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
                {new Date(employee.createdAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour12: false,
                })}
              </td>
              <td className="px-4 py-2">
                {" "}
                {new Date(employee.updatedAt).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  hour12: false,
                })}
              </td>
              <td className="px-4 py-2">
                <button
                  className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-700"
                  onClick={() => {
                    router.push("/employee/edit/" + employee.id);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>

              <td className="px-4 py-2">
                <button
                  className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-700"
                  onClick={() => {
                    deleteEmployee.mutate({ id: employee.id });
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
