import { getDuesByUser } from "@/axios/due/due";
import { IDue } from "@/axios/due/types";
import { useAppSelector } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const CustomerDue = () => {
    const { customer } = useAppSelector(s => s.userInfo);
    const { data = [] } = useQuery<IDue[]>({
        queryKey: ['customersDue'],
        queryFn: () => getDuesByUser(customer._id),
    });

    const totalDue = data.reduce((acc, { dueAmount }) => acc + dueAmount, 0);
    const [editing, setEditing] = useState<string | null>(null);
    const [editedDue, setEditedDue] = useState<number>(0);
    const [editedStatus, setEditedStatus] = useState<string>("");

    const handleEdit = (id: string, dueAmount: number, duePaymentStatus: string) => {
        setEditing(id);
        setEditedDue(dueAmount);
        setEditedStatus(duePaymentStatus);
    };

    const handleSave = (id: string) => {
        console.log("Saving for ID:", id, editedDue, editedStatus);
        // ✅ call mutation API to save changes here
        setEditing(null);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-2 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">
                        Customer Due Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        Customer: <strong>{customer.fName} {customer.lName}</strong>
                    </div>

                    {data.length > 0 && (
                        <p className="text-md font-semibold text-red-600 mb-6">
                            Total Pending: ${totalDue.toFixed(2)}
                        </p>
                    )}

                    {data.length && <div className="space-y-2">
                        {data.map(due => (
                            <Card key={due._id} className="shadow-sm border p-4">
                                <div className="grid md:grid-cols-3 gap-2 items-center">
                                    <div>
                                        <p className="font-medium">Order #: {due.dueAmount}</p>
                                        <p className="text-sm text-muted-foreground">Placed on: {new Date(due?.createdAt as Date).toLocaleDateString()}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Due Amount</Label>
                                        {editing === due._id ? (
                                            <Input
                                                type="number"
                                                value={editedDue}
                                                onChange={(e) => setEditedDue(Number(e.target.value))}
                                            />
                                        ) : (
                                            <p>${due.dueAmount.toFixed(2)}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Payment Status</Label>
                                        {editing === due._id ? (
                                            <Select value={editedStatus} onValueChange={setEditedStatus}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Paid">Paid</SelectItem>
                                                    <SelectItem value="Not paid">Not paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p>{due.duePaymentStatus}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4 gap-2">
                                    {editing === due._id ? (
                                        <>
                                            <Button onClick={() => handleSave(due?._id as string)}>Save</Button>
                                            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <Button onClick={() => handleEdit(due?._id as string, due.dueAmount, due.duePaymentStatus)}>
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerDue;