import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';

// Initialize the S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
  try {
    // Log the event for debugging
    console.log('Received event:', event);
    const body = JSON.parse(event.body);
    const { chunkIds } = body;

    if (!Array.isArray(chunkIds)) {
      throw new Error('chunkIds must be an array');
    }

    console.log('Received chunkIds:', chunkIds);

    // Loop through each chunkId and upload the audio chunk to S3
    for (const chunkId of chunkIds) {
      const chunkData = body[chunkId];  // Get the base64 encoded audio chunk
      const bufferData = Buffer.from(chunkData, 'base64');  // Convert base64 to binary buffer

      const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: `audio-chunks/${chunkId}.wav`,  // Save each chunk as a .wav file
        Body: bufferData,
        ContentType: 'audio/wav',
        ACL: 'private',  // You can modify this if you want public access
      };

      await s3.send(new PutObjectCommand(uploadParams));
      console.log(`Successfully uploaded chunk: ${chunkId}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Audio chunks uploaded successfully' }),
    };
  } catch (error) {
    console.error('Error uploading audio chunks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to upload audio chunk', error: error.message }),
    };
  }
};
