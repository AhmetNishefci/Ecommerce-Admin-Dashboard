import { format } from "date-fns";

import prisma from "@/lib/prismadb";

import { SizesClient } from "./components/client";
import { SizesColumn } from "./components/columns";

const SizesPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const { storeId } = params

    const sizes = await prisma.size.findMany({
        where: {
            storeId
        }
    })

    const formattedSizes: SizesColumn[] = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient sizesData={formattedSizes}/>
            </div>
        </div>
    );
}

export default SizesPage;