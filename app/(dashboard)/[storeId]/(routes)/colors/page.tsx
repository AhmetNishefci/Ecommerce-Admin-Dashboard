import { format } from "date-fns";

import prisma from "@/lib/prismadb";

import { ColorClient } from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorsPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const { storeId } = params

    const colors = await prisma.color.findMany({
        where: {
            storeId
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedColors: ColorColumn[] = colors.map((color) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        createdAt: format(color.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorClient colorsData={formattedColors}/>
            </div>
        </div>
    );
}

export default ColorsPage;