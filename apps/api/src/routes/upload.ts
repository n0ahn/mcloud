import { Hono } from 'hono'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'


const router = new Hono()

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
  forcePathStyle: true,
})

router.post('/world', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    const worldId = formData.get('worldId') as string
    const userId = formData.get('userId') as string

    const buffer = await file.arrayBuffer()

    await s3.send(new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_ID,
      Key: `${userId}/${worldId}.zip`,
      Body: Buffer.from(buffer),
      ContentType: 'application/zip',
    }))

    return c.json({ success: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: String(err) }, 500)
  }
})

router.post('/download-url', async (c) => {
  try {
    const { worldId, userId } = await c.req.json()

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET_ID,
      Key: `${userId}/${worldId}.zip`,
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    return c.json({ url })
  } catch (err) {
    console.error(err)
    return c.json({ error: String(err) }, 500)
  }
})

router.delete('/world', async (c) => {
  try {
    const { worldId, userId } = await c.req.json()

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_ID,
      Key: `${userId}/${worldId}.zip`,
    }))

    return c.json({ success: true })
  } catch (err) {
    console.error(err)
    return c.json({ error: String(err) }, 500)
  }
})



export default router