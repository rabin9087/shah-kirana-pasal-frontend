import { getDuesByUser } from "@/axios/due/due"
import { IDue } from "@/axios/due/types"
import { useAppSelector } from "@/hooks"
import { useQuery } from "@tanstack/react-query"

const CustomerDue = () => {
    const { customer } = useAppSelector(s => s.userInfo)


    const { data = [] } = useQuery<IDue[]>({
        queryKey: ['customersDue'],
        queryFn: () => getDuesByUser(customer._id),
    });

    const totalDue = data.reduce((acc, {dueAmount}) => acc + dueAmount, 0);

    console.log(data)
    return (
        <div>Customer Due Details
            <h3>Customer name: {customer.fName + " " + customer.lName}</h3>
           {data.length > 0 &&  <p><strong>Total Pending:</strong> ${totalDue.toFixed(2)}</p>}
            {/* <p><strong>Due Amount:</strong> ${dueAmount.toFixed(2)}</p>
            <p><strong>Payment Status:</strong> {duePaymentStatus}</p>
            <p><strong>Active Status:</strong> {isActive ? "Active" : "Inactive"}</p> */}
        </div>
    )
}
export default CustomerDue