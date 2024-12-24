import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { fileName } = body;

    if (!fileName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'File name is required' }),
      };
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
    };

    await s3.send(new DeleteObjectCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Successfully deleted ${fileName} from S3` }),
    };
  } catch (error) {
    console.error('Error deleting audio file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete audio', error: error.message }),
    };
  }
};
