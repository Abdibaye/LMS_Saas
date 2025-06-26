import {z} from "zod"
import { NextResponse } from "next/server"
import { env } from "process"
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "@/lib/s3.client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: "File name is required"}),
    fileType: z.string().min(1, {message: "File type is required"}),
    fileSize: z.number().min(1, {message: "File size is required"}),
    isImage: z.boolean(),
})

 export async function POST(request:Request) {
    try{
        const body = await request.json()
        const validation = fileUploadSchema.safeParse(body)

        if(!validation.success){
            return NextResponse.json({error:"Invalid request body"}, {status: 400})

        } 

        const {fileName, fileType, fileSize, isImage} = validation.data

        const uniqueFileName = `${uuidv4()}-${fileName}`

        const command = new PutObjectCommand({
            Bucket: env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: body,
            ContentType: fileType,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 5,
        })

        const response = {
            presignedUrl,
            Key: uniqueFileName
        }; 

        return NextResponse.json(response, {status: 200})
        
    } catch {
        return NextResponse.json(
            {error: "Failed to generate presigned url"},
            {status: 500}
        )
    }
 }