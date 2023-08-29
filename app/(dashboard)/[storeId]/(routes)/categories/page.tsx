import { format } from "date-fns";

import prisma from "@/lib/prismadb";

import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const { storeId } = params

    const categories = await prisma.category.findMany({
        where: {
            storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedCategories: CategoryColumn[] = categories.map((categories) => ({
        id: categories.id,
        name: categories.name,
        billboardLabel: categories.billboard.label,
        createdAt: format(categories.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient categoriesData={formattedCategories}/>
            </div>
        </div>
    );
}

export default CategoriesPage;