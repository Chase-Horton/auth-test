'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image'
export default function MovieCard() {
    return (
        <div className="flex justify-center items-center w-screen h-screen">
                <Card className="w-[350px] bg-slate-950">
                    <CardHeader>
                        <CardTitle className="text-">Shawshank Redemption</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <Image
                            src="https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg"
                            alt="Shawshank Redemption Poster"
                            width={300}
                            height={300}
                            className="rounded-lg"
                            draggable={false}
                        />
                    </CardContent>
                </Card>
        </div>
    )
}