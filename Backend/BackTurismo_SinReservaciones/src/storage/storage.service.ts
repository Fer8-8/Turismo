import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async getSignedUploadUrl(fileName: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      ContentType: mimeType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
  }

  async uploadFile(file: Buffer, fileName: string, mimeType: string): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: mimeType,
      }),
    );

    return `${process.env.R2_PUBLIC_URL}/${fileName}`;
  }


  async deleteFile(fileName: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
      });

      console.log('Enviando comando de eliminación a R2 con key:', fileName);
      await this.s3Client.send(command);
      return { success: true };
    } catch (error) {
      console.error('Error borrando de R2:', error);
      throw new Error('No se pudo borrar el archivo del almacenamiento');
    }
  }
}