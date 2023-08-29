import prisma from "@/lib/prismadb";
import { ProductForm } from "./components/productForm";

const ProductPage = async ({
    params
}: {
    params: {
        productId: string,
        storeId: string
    }
}) => {
    const { productId, storeId } = params

    const product = await prisma.product.findUnique({
        where: {
            id: productId
        },
        include: {
           images: true,
        }
    })

    const categories = await prisma.category.findMany({
        where: {
            storeId
        },
        orderBy: {
            name: "asc"
        },
    })

    const sizes = await prisma.size.findMany({
        where: {
            storeId
        },
        orderBy: {
            name: "asc"
        }
    })

    const colors = await prisma.color.findMany({
        where: {
            storeId
        },
        orderBy: {
            name: "asc"
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm 
                    productsData={product}
                    categories={categories}
                    sizes={sizes}
                    colors={colors}
                    />
            </div>
        </div>
    )
}

export default ProductPage;