import { format } from "date-fns";

import prisma from "@/lib/prismadb";

import { formatCurrency } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const { storeId } = params

    const products = await prisma.product.findMany({
        where: {
            storeId
        },
        include: {
            category: true,
            size: true,
            color: true,
         },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedProducts: ProductColumn[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        isFeatured: product.isFeatured,
        isArchived: product.isArchived,
        price: formatCurrency(product.price.toNumber()),
        category: product.category.name,
        size: product.size.name,
        color: product.color.value,
        createdAt: format(product.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient productsData={formattedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;