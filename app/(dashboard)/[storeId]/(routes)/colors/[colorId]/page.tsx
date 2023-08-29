import prisma from "@/lib/prismadb";
import { ColorForm } from "./components/colorForm";

const ColorPage = async ({
    params
}: {
    params: {
        colorId: string
    }
}) => {
    const { colorId } = params

    const color = await prisma.color.findUnique({
        where: {
            id: colorId
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorForm colorData={color}/>
            </div>
        </div>
    )
}

export default ColorPage;