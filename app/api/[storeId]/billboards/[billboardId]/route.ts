import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import prisma from "@/lib/prismadb"

export const GET = async (req: Request, { params } : { params: { billboardId: string } }) => {
    try{
        const { billboardId } = params

        if (!billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 })
        }

        const billboard = await prisma?.billboard.findUnique({
            where: {
                id: billboardId,
            },
        })

        return NextResponse.json(billboard)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const PATCH = async (req: Request, { params } : { params: { billboardId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const body = await req.json()
        const { label, imageUrl } = body
        const { billboardId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated!", { status: 403 })
        }

        if (!label){
            return new NextResponse("Name is required", { status: 400 })
        }

        if (!imageUrl){
            return new NextResponse("ImageUrl is required", { status: 400 })
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

        const billboard = await prisma?.billboard.updateMany({
            where: {
                id: billboardId,
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request, { params } : { params: { billboardId: string, storeId: string } }) => {
    try{
        const { userId } = auth()
        const { billboardId, storeId } = params

        if (!userId){
            return new NextResponse("Unauthenticated", { status: 403 })
        }

        if (!billboardId){
            return new NextResponse("Billboard Id is required", { status: 400 })
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

        const billboard = await prisma?.billboard.deleteMany({
            where: {
                id: billboardId,
            },
        })

        return NextResponse.json(billboard)
    } catch(error){
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

