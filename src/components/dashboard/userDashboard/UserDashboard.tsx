import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllUsers } from "@/axios/user/user.axios";
import { IUser } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";// Assuming you have an Alert component

const UsersDashboard = () => {
    const { data: users = [], isLoading, isError } = useQuery<IUser[]>({
        queryKey: ["allUsers"],
        queryFn: getAllUsers,
    });

    return (
        <div className="overflow-x-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg md:text-2xl font-bold">Users Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* {isError && <Alert type="error" message="Failed to fetch users" />} */}

                    {!isLoading && !isError && users.length === 0 && (
                        <p className="text-center text-gray-500">No users found.</p>
                    )}

                    {!isLoading && !isError && users.length > 0 && (
                        <div className="overflow-auto w-full">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-200">
                                        <TableCell className="text-xs md:text-sm">S.N.</TableCell>
                                        <TableCell className="text-xs md:text-sm">Name</TableCell>
                                        <TableCell className="text-xs md:text-sm">Email</TableCell>
                                        <TableCell className="text-xs md:text-sm">Phone</TableCell>
                                        <TableCell className="text-xs md:text-sm">Address</TableCell>
                                        <TableCell className="text-xs md:text-sm">Status</TableCell>
                                        <TableCell className="text-xs md:text-sm">Verified</TableCell>
                                        <TableCell className="text-xs md:text-sm">Role</TableCell>
                                        <TableCell className="text-xs md:text-sm">Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user, index) => (
                                        <TableRow key={user._id}>
                                            <TableCell className="whitespace-nowrap">{index + 1}</TableCell>
                                            <TableCell className="whitespace-nowrap">{`${user.fName} ${user.lName}`}</TableCell>
                                            <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                            <TableCell className="whitespace-nowrap">{user.phone}</TableCell>
                                            <TableCell className="whitespace-nowrap">{user.address}</TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <span className={user?.status === "ACTIVE" ? "text-green-500" : "text-red-500"}>
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <span className={user?.isVerified ? "text-green-500" : "text-red-500"}>
                                                    {user.isVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <span className={`${user.role === "ADMIN" ? "text-green-500" : "text-primary"}`}>
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Link to={`/dashboard/user/${user.phone}`} className="p-2 px-4 w-1/2 bg-gray-200 rounded-md text-sm">
                                                        View
                                                    </Link>
                                                    <Link to={`/edit/userProfile/${user.phone}`} className="p-2 px-4 w-1/2 bg-blue-500 text-white rounded-md text-sm">
                                                        Edit
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersDashboard;
