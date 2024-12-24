import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);  // Parse the request body to get the filename
    const fileName = body.fileName;

    if (!fileName) {
      throw new Error('fileName is required');
    }

    // Fetch the file from S3 using the provided filename
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,  // Use the dynamic filename from the request
    };

    const data = await s3.send(new GetObjectCommand(params));

    // Generate the URL for the audio file in S3
    const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Audio file retrieved successfully',
        url: fileUrl,  // Return the URL of the audio file
      }),
    };
  } catch (error) {
    console.error('Error retrieving audio file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to retrieve audio file',
        error: error.message,
      }),
    };
  }
};
