import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const GET = async (req: Request, { params } : { params: { productId: string } }) => {
    try{
        const { productId } = params

        if (!productId){
            return new NextResponse("Product Id is required", { status: 400 })
        }

        const product = await prisma?.product.findUnique({
            where: {
                id: productId,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            }
        })

        return NextResponse.json(product)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const PATCH = async (req: Request, { params } : { params: { productId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const body = await req.json()

        const { productId, storeId } = params

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if (!name){
            return new NextResponse("Missing name", { status: 400 })
        }

        if (!images || !images.length){
            return new NextResponse("Missing images", { status: 400 })
        }

        if (!price){
            return new NextResponse("Missing price", { status: 400 })
        }
        
        if (!categoryId){
            return new NextResponse("Missing category", { status: 400 })
        }

        if (!colorId){
            return new NextResponse("Missing color", { status: 400 })
        }

        if (!sizeId){
            return new NextResponse("Missing size", { status: 400 })
        }

        if (!productId){
            return new NextResponse("Missing product", { status: 400 })
        }

        const storeByUserId = await prisma?.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId){
            return new NextResponse("Unauthorized!", { status: 405 })
        }

         await prisma?.product.update({
            where: {
                id: productId,
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived
            }
        })

        const product = await prisma?.product.update({
            where: {
                id: productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image)
                        ]
                    }
                },
            }
        })

        return NextResponse.json(product)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { productId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const { productId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!productId){
            return new NextResponse("Product Id is required", { status: 400 })
        }

        const storeByUserId = await prisma?.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId){
            return new NextResponse("Unauthorized!", { status: 405 })
        }

        const product = await prisma?.product.deleteMany({
            where: {
                id: productId,
            },
        })

        return NextResponse.json(product)
    } catch(error){
        console.log('HERE', error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

