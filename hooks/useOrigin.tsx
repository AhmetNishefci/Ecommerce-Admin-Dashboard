import { useEffect } from "react"
import { useBoolean } from "usehooks-ts"

 export const useOrigin = () => {
    const {value: isMounted , setTrue: setMountedTrue} = useBoolean(false)

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""

    useEffect(() => {
        setMountedTrue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if(!isMounted){
        return ""
    }

    return origin
 }