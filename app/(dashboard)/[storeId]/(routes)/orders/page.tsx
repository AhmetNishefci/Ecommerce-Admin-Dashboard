import { format } from "date-fns";

import prisma from "@/lib/prismadb";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatCurrency } from "@/lib/utils";

const OrdersPage = async ({
    params
}: {
    params: {
        storeId: string
    }
}) => {
    const { storeId } = params

    const orders = await prisma.order.findMany({
        where: {
            storeId: storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        phone: order.phone,
        address: order.address,
        products: order.orderItems.map((orderItem) => orderItem.product.name).join(", "),
        totalPrice: formatCurrency(order.orderItems.reduce((acc, orderItem) => {
            return acc + orderItem.product.price.toNumber()
        }, 0 )),
        isPaid: order.isPaid,
        createdAt: format(order.createdAt, "MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient orderData={formattedOrders}/>
            </div>
        </div>
    );
}

export default OrdersPage;