import { BadRequestException, Body, Controller, Param, Post, Delete, UploadedFiles, UseGuards, UseInterceptors, ForbiddenException, Patch } from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ID } from '@nestjs/graphql';
import { StorageService } from '../storage/storage.service';
import { CreateMediaInput } from './dto/create-media.input';
import type { Express } from 'express';

@Controller('media')
export class MediaController {

   constructor(
      private mediaService: MediaService,
      private storageService: StorageService
   ){

   }

  @UseGuards(AuthGuard)
  @Post('request-upload')
  async upload(
    @Body() createMediaInput: CreateMediaInput,
    @Body('fileName') fileName: string,
    @Body('fileType') fileType: string,
    @CurrentUser() user: any,
  ){
    
    const userid = user.id;
    const fileKey = `${crypto.randomUUID()}-${fileName}`;

    const uploadUrl = await this.storageService.getSignedUploadUrl(fileKey, fileType);

    const media = await this.mediaService.create({fileKey, createMediaInput:{user_id: userid, ...createMediaInput}, fileType});
  
    return {
      uploadUrl,
      mediaId: media.id,
      fileKey,
      userid
    };
    // return this.mediaService.create( {...CreateMediaInput, user_id: userid}, file);
  }

  @Patch(':id/confirm')
  @UseGuards(AuthGuard)
  async confirm(@Param('id') id: string) {
    return await this.mediaService.confirmUpload(id);
  }

  @UseGuards(AuthGuard)
  @Delete('removefile/:id')
  async remove(
   @Param('id') id: string,
   @CurrentUser() user: any,
) {

    const userid = user.id;

    // if (id !== userid){
    //   throw new ForbiddenException();
    // }else{}
      return this.mediaService.remove(id);
    
    
  }
  @UseGuards(AuthGuard)
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultiple(
    @UploadedFiles() files: any[],
    @Body() createMediaInput: CreateMediaInput,
    @Body('alt_text') alt_text: string,
    @Body('alt_texts') alt_texts: string | string[],
    @CurrentUser() user: any,
  ) {
    const userid = user.id;

    // Normalizar alt_texts a array
    const altTextsArray: string[] = alt_texts
      ? Array.isArray(alt_texts) ? alt_texts : [alt_texts]
      : [];

    // Validar que cada archivo tenga su alt_text si se mandó por array
    if (altTextsArray.length > 0 && altTextsArray.length !== files.length) {
      throw new BadRequestException({
        message: `Se enviaron ${altTextsArray.length} alt_texts pero hay ${files.length} archivos. Deben coincidir.`,
        example: {
          opcion_1: {
            descripcion: 'Un alt_text para todos los archivos',
            fields: { alt_text: 'foto del centro', 'files[]': ['img1.jpg', 'img2.jpg', 'img3.jpg'] },
          },
          opcion_2: {
            descripcion: 'Un alt_texts[] por cada archivo (deben ser el mismo número)',
            fields: { 'alt_texts[]': ['foto exterior', 'foto interior', 'foto jardín'], 'files[]': ['img1.jpg', 'img2.jpg', 'img3.jpg'] },
          },
        },
      });
    }

    // Validar que exista al menos una fuente de alt_text
    if (!alt_text && altTextsArray.length === 0) {
      throw new BadRequestException({
        message: 'Debes enviar "alt_text" (para todos) o "alt_texts[]" (uno por archivo).',
        example: {
          opcion_1: {
            descripcion: 'Un alt_text para todos los archivos',
            fields: { alt_text: 'foto del centro', 'files[]': ['img1.jpg', 'img2.jpg'] },
          },
          opcion_2: {
            descripcion: 'Un alt_texts[] por cada archivo',
            fields: { 'alt_texts[]': ['foto exterior', 'foto interior'], 'files[]': ['img1.jpg', 'img2.jpg'] },
          },
        },
      });
    }

    const results = await Promise.all(
      files.map(async (file: any, index: number) => {
        const resolvedAltText = altTextsArray.length > 0 ? altTextsArray[index] : alt_text;

        if (!resolvedAltText) {
          throw new BadRequestException(
            `Falta alt_text para el archivo "${file.originalname}" (posición ${index + 1}).`,
          );
        }

        const fileKey = `${crypto.randomUUID()}-${file.originalname}`;

        const uploadedFile = await this.storageService.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
        );

        const media = await this.mediaService.create({
          fileKey,
          createMediaInput: {
            ...createMediaInput,
            user_id: userid,
            alt_text: resolvedAltText,
          },
          fileType: file.mimetype,
        });

        return {
          fileKey,
          mediaId: media.id,
          originalName: file.originalname,
          uploadedFile,
        };
      }),
    );

    return results;
  }
}
