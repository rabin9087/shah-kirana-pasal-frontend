// import { getAllUsers } from "@/axios/user/user.axios";
import { useAppSelector } from "@/hooks";
// import { setUsers } from "@/redux/dashboard.slice";
// import { IUser } from "@/types";
// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { getAllUserAction } from "@/action/user.action";
// import { AppDispatch } from "@/store";

const UsersDashboard = () => {
    // const dispatch = useAppDispatch<AppDispatch>();
    const { users } = useAppSelector((state) => state.dashboardData);

    // Fetch users with React Query
    // const { data = [] as IUser[], isLoading, error, isFetching } = useQuery<IUser[]>({
        
    //     queryKey: ["alluser"],
    //     queryFn: async () =>await getAllUsers(),
    // });

    // useEffect(() => {
    //     try {
    //         dispatch(getAllUserAction())
    //     } catch (error) {
            
    //     }
      
    // }, [dispatch]);

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Users Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* {isLoading || isFetching ? (
                        <div className="text-center text-lg font-medium">Loading...</div>
                    ) : error ? (
                        <div className="text-center text-red-500 font-medium">
                            Failed to load users. Please try again.
                        </div>
                    ) : ( */}
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Phone</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user._id}>
                                            <TableCell>{user._id}</TableCell>
                                            <TableCell>{`${user.fName} ${user.lName}`}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    // variant={user.isVerified ? "success" : "warning"}
                                                >
                                                    {user.isVerified ? "Verified" : "Unverified"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    // variant={user.role === "ADMIN" ? "primary" : "default"}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Handle view user details
                                                            console.log("Viewing user:", user._id);
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Handle edit user
                                                            console.log("Editing user:", user._id);
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Handle delete user
                                                            console.log("Deleting user:", user._id);
                                                        }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersDashboard;
