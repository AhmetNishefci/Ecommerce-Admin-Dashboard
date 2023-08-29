import prisma from "@/lib/prismadb";
import { CategoryForm } from "./components/categoryForm";

const CategoryPage = async ({
    params
}: {
    params: {
        categoryId: string,
        storeId: string
    }
}) => {
    const { categoryId, storeId } = params

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    })

    const billboards = await prisma.billboard.findMany({
        where: {
            storeId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryForm 
                    categoryData={category} 
                    billboards={billboards}/>
            </div>
        </div>
    )
}

export default CategoryPage;