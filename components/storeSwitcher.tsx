"use client"

import { Store } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useBoolean } from "usehooks-ts"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"

import { Popover, PopoverTrigger,PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { 
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator } from  "@/components/ui/command"
import { cn } from "@/lib/utils"
import { useStoreModal } from "@/hooks/useStoreModal"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[]
}

export const StoreSwitcher = ({
    className,
    items = [],
}: StoreSwitcherProps) => {
    const { openStoreModal } = useStoreModal()
    const { storeId } = useParams()
    const router = useRouter()
    const {value: isStoreSwitcherOpen, setFalse: closeStoreSwitcher, toggle: toggleStoreSwitcher} = useBoolean(false)

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }))

    const activeItem = formattedItems.find((item) => item.value === storeId)

    const handleStoreSelect = (store: {
        label: string
        value: string
    }) => {
        closeStoreSwitcher()
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={isStoreSwitcherOpen} onOpenChange={toggleStoreSwitcher}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={isStoreSwitcherOpen}
                    aria-label="Select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4"/>
                    {activeItem?.label ?? "Select a store"}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..."/>
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => handleStoreSelect(store)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4"/>
                                    {store.label}
                                    <Check 
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            store.value === activeItem?.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                closeStoreSwitcher()
                                openStoreModal()
                            }}>
                                <Button size="sm" variant="outline">
                                    <PlusCircle className="mr-2 h-5 w-5"/>
                                    Create Store    
                                </Button>
                                
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}