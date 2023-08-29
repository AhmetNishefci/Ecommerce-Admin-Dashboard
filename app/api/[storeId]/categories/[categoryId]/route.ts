import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const GET = async (req: Request, { params } : { params: { categoryId: string } }) => {
    try{
        const { categoryId } = params

        if (!categoryId){
            return new NextResponse("Category Id is required", { status: 400 })
        }

        const category = await prisma?.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                billboard: true
            }
        })

        return NextResponse.json(category)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const PATCH = async (req: Request, { params } : { params: { categoryId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { name, billboardId } = body
        const { categoryId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated!", { status: 403 })
        }

        if (!name){
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!billboardId){
            return new NextResponse("BillboardId is required", { status: 400 })
        }

        if (!billboardId){
            return new NextResponse("Billboard ID is required", { status: 400 })
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

        const category = await prisma?.category.updateMany({
            where: {
                id: categoryId,
            },
            data: {
                name,
                billboardId
            }
        })

        return NextResponse.json(category)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { categoryId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const { categoryId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!categoryId){
            return new NextResponse("Category Id is required", { status: 400 })
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

        const category = await prisma?.category.deleteMany({
            where: {
                id: categoryId,
            },
        })

        return NextResponse.json(category)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

