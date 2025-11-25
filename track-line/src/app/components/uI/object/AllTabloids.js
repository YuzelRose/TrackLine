'use client'

import DropSVG from "@/app/media/DropSVG"
import { peticion } from "@/app/utils/Funtions"
import { useEffect, useState } from "react"

export default function AllTabloids() {
    const [data, setData] = useState([])
    useEffect(() => {
        const getTabloids = async () => {
            try {
                const response = await peticion('tabloids/get-all')
                if(response.httpStatus === 200) setData(response.data)
            } catch(error){
                alert(error)
            }
        }
        getTabloids()
    }, [])

    return(
        <section>
            {data?
                data.map(tab => {
                    <div key={tab._id}>
                        <p>{tab.Name}</p>
                        <p>Impartida por: {data.Owner}</p>
                        <div onClick={() => setDrop(!drop)}>
                            {drop?
                            tab.description
                            : null}
                            <DropSVG/>
                        </div>
                    </div>
                })
            :null}
        </section>
    )
}