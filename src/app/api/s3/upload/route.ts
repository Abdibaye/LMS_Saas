import {z} from "zod"
import { NextResponse } from "next/server"
import { env } from "process"
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from "@/lib/s3.client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { requireAdmin } from "@/app/data/admin/require-admin";

export const fileUploadSchema = z.object({
    fileName: z.string().min(1, {message: "File name is required"}),
    fileType: z.string().min(1, {message: "File type is required"}),
    fileSize: z.number().min(1, {message: "File size is required"}),
    isImage: z.boolean(),
});

const aj = arcjet.withRule(
    detectBot({
        mode: "LIVE",
        allow: [], 
    }
    )
).withRule(
    fixedWindow({
        mode: "LIVE",
        window: "1m",
        max: 5,  
    })
)



 export async function POST(request:Request) {
     const session = await requireAdmin();
    try{

        const desision = await aj.protect(request,{
            fingerprint: session?.user.id as string
        })

        if(desision.isDenied()){
            return NextResponse.json({
                error: "not good",
            }, {
                status: 429
            })
        }
        
        const body = await request.json()
        const validation = fileUploadSchema.safeParse(body)

        if(!validation.success){
            return NextResponse.json({error:"Invalid request body"}, {status: 400})

        } 

        const {fileName, fileType, fileSize, isImage} = validation.data

        const uniqueFileName = `${uuidv4()}-${fileName}`

        const bucketName = env.NEXT_PUBLIC_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error("AWS_S3_BUCKET_NAME environment variable is not set.");
        }

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: uniqueFileName,
            ContentType: fileType,
        })

        const presignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 60 * 5,
        })

        const response = {
            presignedUrl,
            key: uniqueFileName
        }; 

        return NextResponse.json(response, {status: 200})
        
    } catch (err) {
        console.error("S3 presigned URL error:", err);
        return NextResponse.json(
            {error: "Failed to generate presigned url"},
            {status: 500}
        )
    }
 }