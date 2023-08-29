import prisma from "@/lib/prismadb";

import { SizeForm } from "./components/sizeForm";

const SizePage = async ({
    params
}: {
    params: {
        sizeId: string
    }
}) => {
    const { sizeId } = params

    const size = await prisma.size.findUnique({
        where: {
            id: sizeId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizeForm sizesData={size}/>
            </div>
        </div>
    )
}

export default SizePage;