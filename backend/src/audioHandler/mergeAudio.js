import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { streamToBuffer } from '../helpers/s3Helper';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { chunkIds } = body;

    if (!Array.isArray(chunkIds)) {
      throw new Error('chunkIds must be an array');
    }

    const audioChunks = [];

    // Retrieve each chunk from S3 and merge them
    for (const chunkId of chunkIds) {
      const params = {
        Bucket: BUCKET_NAME,
        Key: `audio-chunks/${chunkId}.wav`,
      };
      const data = await s3.send(new GetObjectCommand(params));
      const chunkData = await streamToBuffer(data.Body);
      audioChunks.push(chunkData);
    }

    // Merge the audio chunks into a single buffer
    const mergedAudio = Buffer.concat(audioChunks);

    // Upload the merged audio file to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: 'merged-audio.wav',
      Body: mergedAudio,
      ContentType: 'audio/wav',
      ACL: 'private',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Audio merged and uploaded successfully' }),
    };
  } catch (error) {
    console.error('Error merging audio chunks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to merge audio', error: error.message }),
    };
  }
};
