import prisma from "@/lib/prismadb";
import { BillboardForm } from "./components/billboardForm";

const BillboardPage = async ({
    params
}: {
    params: {
        billboardId: string
    }
}) => {
    const { billboardId } = params

    const billboard = await prisma.billboard.findUnique({
        where: {
            id: billboardId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm billboardData={billboard}/>
            </div>
        </div>
    )
}

export default BillboardPage;