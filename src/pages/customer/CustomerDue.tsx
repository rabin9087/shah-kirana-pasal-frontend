import { getDuesByUser, updateUsersDuesById } from "@/axios/due/due";
import { IDue } from "@/axios/due/types";
import { useAppSelector } from "@/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";

const CustomerDue = () => {
    const { customer } = useAppSelector((s) => s.userInfo);
    const queryClient = useQueryClient();
    const { data = [] } = useQuery<IDue[]>({
        queryKey: ["customersDue", customer._id],
        queryFn: () => getDuesByUser(customer._id),
    });

    const totalDue = data.reduce((acc, { dueAmount }) => acc + dueAmount, 0);
    const [editing, setEditing] = useState<string | null>(null);
    const [editedDue, setEditedDue] = useState<number>(0);
    const [openDueId, setOpenDueId] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const [openSection, setOpenSection] = useState<"items" | "history" | null>(null);

    const handleEdit = (id: string, dueAmount: number) => {
        setEditing(id);
        setEditedDue(dueAmount);
    };

    const handleSave = async (id: string, dueAmount: number) => {
        if (editedDue <= 0 || editedDue > dueAmount) {
            toast.error("Invalid amount");
            return;
        }

        await updateUsersDuesById(id, {
            dueAmount: dueAmount - editedDue,
            duePaymentStatus: dueAmount === editedDue ? "Paid" : "Not Paid",
            isActive: dueAmount !== editedDue,
            paymentHistory: { paymentMethod: selectedMethod, amount: editedDue },
        });

        queryClient.invalidateQueries({ queryKey: ["customersDue", customer._id] });
        setEditing(null);
    };

    const toggleSection = (id: string, section: "items" | "history") => {
        if (openDueId === id && openSection === section) {
            setOpenDueId(null);
            setOpenSection(null);
        } else {
            setOpenDueId(id);
            setOpenSection(section);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-2 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">Customer Due Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        Customer: <strong>{customer.fName} {customer.lName}</strong>
                    </div>

                    {data.length > 0 && (
                        <p className="text-md font-semibold text-red-600 mb-2">
                            Total Pending: Rs. {totalDue.toFixed(2)}
                        </p>
                    )}

                    {data.length > 0 && <div className="flex justify-end">
                        <span className="font-thin text-sm text-blue-600 hover:underline mb-2">Show all Due</span>
                    </div>}
                    {data.length === 0 && <div className="flex justify-center">
                        <span className="font-thin text-base text-red-600 underline mb-2">No dues available!</span>
                    </div>}
                    {data.length > 0 && (
                        <div className="space-y-4">
                            {data.map((due) => (
                                <Card key={due._id} className="shadow-sm border p-4">
                                    <div className="flex items-center justify-between my-2">
                                        <Label className="font-bold">Total Due: Rs. {due.totalAmout.toFixed(2)}</Label>
                                        <p className={`text-sm font-thin ${due.duePaymentStatus === "Paid" ? "text-green-600" : "text-red-600"}`}>
                                            {due.duePaymentStatus}
                                        </p>
                                    </div>

                                    <div className="flex justify-between">
                                        <Label className="font-medium">Remaining Due: Rs. {due.dueAmount.toFixed(2)}</Label>
                                        <p className="text-sm text-primary">
                                            {new Date(due.createdAt as Date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <form>
                                        {editing === due._id && (
                                            <div className="space-y-2 mt-2">

                                                {/* Payment Method Select */}
                                                <select
                                                    className="w-full px-3 py-2 border rounded-md text-sm"
                                                    value={selectedMethod}
                                                    required
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                >
                                                    <option value="">Select Payment Method</option>
                                                    <option value="Cash">Cash</option>
                                                    <option value="eSewa">eSewa</option>
                                                    <option value="PhonePay">PhonePay</option>
                                                    <option value="Bank Account">Bank Account</option>
                                                </select>
                                                {/* Payment Amount Input */}
                                                <Input
                                                    placeholder="Enter the amount paid"
                                                    className="my-2"
                                                    type="number"
                                                    required
                                                    onChange={(e) => {
                                                        const value = Number(e.target.value);
                                                        if (value <= 0 || value > due.dueAmount) {
                                                            return;
                                                        }
                                                        setEditedDue(value);
                                                    }}
                                                />
                                            </div>
                                        )}

                                        {editing === due._id ? (
                                            <div className="flex justify-end mt-4 gap-2">
                                                <Button type="submit" onClick={() => handleSave(due._id as string, due.dueAmount)}>Save</Button>
                                                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end mt-4">
                                                <Button type="button" onClick={() => handleEdit(due._id as string, due.dueAmount)}>Edit</Button>
                                            </div>
                                        )}
                                    </form>
                                    <div className="flex justify-between text-blue-600 text-sm mt-4 space-y-1 cursor-pointer">
                                        <p onClick={() => toggleSection(due._id as string, "items")} className="hover:underline">
                                            {openDueId === due._id && openSection === "items" ? "Hide Items" : "Show Items"}
                                        </p>
                                        <p onClick={() => toggleSection(due._id as string, "history")} className="hover:underline">
                                            {openDueId === due._id && openSection === "history" ? "Hide Payment History" : "Show Payment History"}
                                        </p>
                                    </div>

                                    {openDueId === due._id && openSection === "items" && (
                                        <div className="p-4 space-y-4">
                                            {typeof due.salesId === "object" && Array.isArray(due.salesId.items) && due.salesId.items.map((item) =>
                                                item?.productId && (typeof item.productId === "object" &&
                                                    <div key={item.productId._id} className="flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-white">
                                                        <img
                                                            src={item.productId.images?.[0] as string}
                                                            alt={item.productId?.name}
                                                            className="h-16 w-16 object-cover rounded-md"
                                                        />
                                                        <div className="flex-1">
                                                            <h3 className="text-sm font-semibold text-gray-800">{item.productId.name}</h3>
                                                            <div className="flex flex-wrap text-xs text-gray-500 gap-2 mt-1">
                                                                <p>Qty: {item.orderQuantity}</p>
                                                                <p>Price: Rs. {item.price}</p>
                                                                <p className="font-semibold text-gray-700">
                                                                    Total: Rs. {(item.price * item.orderQuantity).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}


                                    {openDueId === due._id && openSection === "history" && (
                                        <div className="border rounded-lg p-4 bg-muted/50 mt-4 space-y-3">
                                            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Payment History</h4>
                                            {due.paymentHistory && due.paymentHistory.length > 0 ? (
                                                due.paymentHistory.map(({ amount, paymentDate, paymentMethod }, i) => (
                                                    <div key={i} className="flex justify-between items-center bg-white rounded-md p-2 shadow-sm border">
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-thin text-emerald-600">Method: {paymentMethod}</span>
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-thin text-emerald-600">Rs. {amount.toFixed(2)}</span>
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(paymentDate).toLocaleString("en-AU", {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400">No payments recorded.</p>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default CustomerDue;
