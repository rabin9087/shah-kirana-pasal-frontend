import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllUsers } from "@/axios/user/user.axios";
import { IUser } from "@/types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import SearchInput from "@/components/search/SearchInput";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { setUsers } from "@/redux/dashboard.slice";
import { Button } from "@/components/ui/button";
import Modal from 'react-modal';
import AddUser from "./AddUser";
import { SortKey, sortUsers } from "../utils/SortData";
import { SkeletonProfile } from "@/components/ui/Loading";
import { exportToExcel } from "@/utils/exportToExcel/exportTOExcel";

const UsersDashboard = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const { users } = useAppSelector(s => s.dashboardData);
    const { data = [], isLoading, isError } = useQuery<IUser[]>({
        queryKey: ["allUsers"],
        queryFn: getAllUsers,
    });
    const [usersData, setUsersData] = useState<IUser[]>(users);
    const [sortBy, setSortBy] = useState<SortKey>("name"); // ⬅️ track selected sort key

    // const [selectedUserData, setSelectedUserData] = useState([])


    useEffect(() => {
        if (data.length) {
            const sorted = sortUsers(data, sortBy);
            setUsersData(sorted);
            dispatch(setUsers(sorted));
        }
    }, [data, sortBy, dispatch]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SortKey;
        setSortBy(value);
        const sorted = sortUsers(usersData, value);
        setUsersData(sorted);
    };

    if (isLoading) (<SkeletonProfile />)

    return (
        <div className="overflow-x-auto w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="flex justify-center text-lg md:text-2xl font-bold uppercase underline">Users Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end">
                        <div className="relative group">
                            <p
                                className="p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded"
                                
                            >
                                Download
                            </p>

                            {/* Tooltip */}
                            <span
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                 bg-gray-100 hover:bg-gray-200 text-black text-xs px-2 py-1 rounded 
                 opacity-0 group-hover:opacity-100 
                 transition-opacity duration-200 whitespace-nowrap"
                                onClick={() => exportToExcel(users, "users")}
                            >
                                Export to Excel
                            </span>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center my-20">
                            <SkeletonProfile />
                        </div>
                    )}
                    {!isLoading && !isError && data.length === 0 && (
                        <p className="text-center text-gray-500">No users found.</p>
                    )}
                    {!isLoading && !isError && data.length > 0 && (
                        <div className="overflow-auto w-full">
                            <div className="flex justify-between items-center flex-wrap gap-2 mb-4 px-1">
                                <p>Total Users: {usersData.length}</p>
                                <div className="flex gap-2 items-center">
                                    <p>Sort User by:</p>
                                    <select
                                        className="px-2 py-1 border rounded"
                                        value={sortBy}
                                        onChange={handleSortChange}
                                    >
                                        <option value="name">Name</option>
                                        <option value="createdAt">Created Date</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <SearchInput
                                        placeholder="Search user"
                                        data={users}
                                        searchKeys={["fName", "lName", "email", "phone"]}
                                        setFilteredData={(filtered) => {
                                            const sorted = sortUsers(filtered.length ? filtered : data, sortBy);
                                            setUsersData(sorted);
                                        }}
                                    />
                                    <Button onClick={() => setIsOpen(true)}>+ Add user</Button>
                                </div>
                            </div>

                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-200">
                                        <TableCell>S.N.</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Address</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Verified</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersData.map((user, index) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{`${user.fName} ${user.lName}`}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>{user.address}</TableCell>
                                            <TableCell>
                                                <span className={user.status === "ACTIVE" ? "text-green-500" : "text-red-500"}>
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={user.isVerified ? "text-green-500" : "text-red-500"}>
                                                    {user.isVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className={user.role === "ADMIN" ? "text-green-500" : "text-primary"}>
                                                    {user.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Link to={`/dashboard/user/${user.phone}`} className="p-2 px-4 bg-gray-200 rounded-md text-sm">View</Link>
                                                    <Link to={`/edit/userProfile/${user.phone}`} className="p-2 px-4 bg-primary text-white rounded-md text-sm">Edit</Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Modal
                                isOpen={isOpen}
                                onRequestClose={() => setIsOpen(false)}
                                overlayClassName="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                                className="bg-white p-6 rounded-xl shadow-xl max-h-screen overflow-y-auto w-full max-w-md"
                            >
                                <AddUser />
                                <Button onClick={() => setIsOpen(false)} className="mt-4 w-full">Close</Button>
                            </Modal>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersDashboard;
