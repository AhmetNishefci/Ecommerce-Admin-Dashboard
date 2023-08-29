import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const GET = async (req: Request, { params } : { params: { sizeId: string } }) => {
    try{
        const { sizeId } = params

        if (!sizeId){
            return new NextResponse("Size Id is required", { status: 400 })
        }

        const size = await prisma?.size.findUnique({
            where: {
                id: sizeId,
            },
        })

        return NextResponse.json(size)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const PATCH = async (req: Request, { params } : { params: { sizeId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { name, value } = body
        const { sizeId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated!", { status: 403 })
        }

        if (!name){
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!value){
            return new NextResponse("Value is required", { status: 400 })
        }

        if (!sizeId){
            return new NextResponse("Size ID is required", { status: 400 })
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

        const size = await prisma?.size.updateMany({
            where: {
                id: sizeId,
            },
            data: {
                name,
                value
            }
        })

        return NextResponse.json(size)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { sizeId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const { sizeId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!sizeId){
            return new NextResponse("Size Id is required", { status: 400 })
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

        const size = await prisma?.size.deleteMany({
            where: {
                id: sizeId,
            },
        })

        return NextResponse.json(size)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

