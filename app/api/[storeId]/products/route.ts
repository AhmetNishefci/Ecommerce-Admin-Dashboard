import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const POST = async (req: Request, {
    params
} : {
    params: {
        storeId: string
    }
}) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { storeId } = params
 
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

        if (!storeId){
            return new NextResponse("Missing storeId", { status: 400 })
        }

        const storeByUserId = await prisma?.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if (!storeByUserId){
            return new NextResponse("Unauthorized!", { status: 403 })
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {
                                url: string
                            }) => image)
                        ]
                    }
                },
                storeId,
                isFeatured,
                isArchived
            }
        })

        return NextResponse.json(product)
    }catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const GET = async (req: Request, {
    params
}: {
    params: {
        storeId: string
    }
}) => {
    try{
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get("categoryId") || undefined
        const colorId = searchParams.get("colorId") || undefined
        const sizeId = searchParams.get("sizeId") || undefined
        const isFeatured = searchParams.get("isFeatured") || undefined

        const { storeId } = params

        if (!storeId){
            return new NextResponse("Missing storeId", { status: 400 })
        }

        const products = await prisma.product.findMany({
            where: {
                storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(products)
    } catch (error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

