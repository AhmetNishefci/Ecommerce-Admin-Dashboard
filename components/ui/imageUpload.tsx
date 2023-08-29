"use client"

import { useEffect, useState } from "react"
import { useBoolean } from "usehooks-ts"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"

type ImageUploadProps = {
    disabled?: boolean
    onChange: (file: string) => void
    onRemove: (file: string) => void
    value: string[]
}

export const ImageUpload = ({
    disabled,
    onChange,
    onRemove,
    value
}: ImageUploadProps) => {
    const {value: isMounted, setTrue: setIsMountedTrue} = useBoolean(false)

    const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

    const handleMouseEnter = (file: string) => {
        setHoverStates(prevStates => ({
            ...prevStates,
            [file]: true,
        }));
    };

    const handleMouseLeave = (file: string) => {
        setHoverStates(prevStates => ({
            ...prevStates,
            [file]: false,
        }));
    };

    useEffect(() => {
        setIsMountedTrue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleImageUpload = (result: any) => {
        onChange(result.info.secure_url)
    }

    if (!isMounted) return null

    return (
        <>
            <div className="mb-4 flex items-center gap-4">
                {value.map((file) => (
                    <div key={file} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button  
                                onMouseEnter={() => handleMouseEnter(file)}
                                onMouseLeave={() => handleMouseLeave(file)} type="button" 
                                onClick={() => onRemove(file)}
                                variant={hoverStates[file] ? "destructive" : "default"}  
                                size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image 
                            fill
                            className="object-cover"
                            alt="Billboard image"
                            src={file}
                        />
                    </div>
                ))}
            </div>
            <CldUploadWidget onUpload={handleImageUpload} uploadPreset="ax8exlmf">
                    {({open}) => {
                        const handleClick = () => {
                            open()
                        }
                        return (
                            <Button
                                disabled={disabled}
                                onClick={handleClick}
                                variant="secondary"
                                type="button"
                            >
                                <ImagePlus className="h-4 w-4 mr-2"/>
                                Upload an Image
                            </Button>
                        )
                    }}
            </CldUploadWidget>
        </>
    )
}