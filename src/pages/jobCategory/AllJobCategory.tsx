import { IJobCategory, getAllJobCategories } from "@/axios/jobCategory/jobCategory";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks";

const AllJobCategory = () => {

    const { user } = useAppSelector(s => s.userInfo)
    const { data = [] } = useQuery<IJobCategory[]>({
        queryKey: ["jobCategory", user?._id],
        queryFn: () => getAllJobCategories(user._id),
        refetchOnWindowFocus: true,
    });

    return (
        <div> <Table className="min-w-full border rounded-xl overflow-hidden shadow-sm">
            <TableHeader>
                <TableRow className="bg-gray-100">
                    <TableCell className="text-xs md:text-sm font-semibold">S.N.</TableCell>
                    <TableCell className="text-xs md:text-sm font-semibold">Name</TableCell>
                    <TableCell className="text-xs md:text-sm font-semibold">Created At</TableCell>
                    <TableCell className="text-xs md:text-sm font-semibold">Edit</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((job, index) => {

                    return (
                        <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="whitespace-nowrap text-sm">{index + 1}</TableCell>
                            <TableCell className="whitespace-nowrap text-sm font-semibold hover:cursor-pointer">
                                <Link to={`/jobs/${job._id}`}>
                                    {job.name}
                                </Link>
                            </TableCell>
                            <TableCell className="whitespace-nowrap text-sm">
                                {new Date(job.createdAt as Date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Link to={`/jobs/${job._id}`}>
                                    <Button className="bg-yellow-600 hover:bg-yellow-500 text-white">
                                        View
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table></div>
    )
}
export default AllJobCategory