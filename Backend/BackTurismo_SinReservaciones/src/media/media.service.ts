import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Media } from './entities/media.entity';
import { Prisma } from '@prisma/client';
import { MediaFilters } from './args/media-filters.args';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { MediaResponse } from './dto/media-response.dto';
import { StorageService } from 'src/storage/storage.service';
import { shuffleArray } from '../common/utils/random.util';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly httpService: HttpService
  ) { }

  async uploadToStream(url: string): Promise<any>{

    console.log(url);

    const fileUrl = process.env.VIDEO_PIPELINE_URL;
    if (!fileUrl) {
      throw new Error('VIDEO_PIPELINE_URL environment variable is not defined');
    }

    const body = {
      "url": url
    }
    const config = {
      headers: {
        "X-API-SECRET": process.env.VIDEO_PIPELINE_SECRET,
      }
    }

    try {
      const response = await firstValueFrom(this.httpService.post(fileUrl, body, config));
      return response.data;
    }catch (error){
      // Esto te dirá la verdad de por qué falló el POST
      console.error('Error real de Axios:', error.response?.data || error.message);
    }
    
  }


  async create({createMediaInput, fileKey, fileType}:{ createMediaInput: CreateMediaInput, fileKey: string, fileType: string}) : Promise<Media> {

    // const fileName = `${crypto.randomUUID()}-${file.originalname}`;
    const fileUrl = `${process.env.R2_PUBLIC_URL}/media/${fileKey}`;
    const {alt_text,event_id,place_id,review_id,user_id} = createMediaInput
 

    try {
      const createdMedia = await this.prisma.media.create({
        data: {
          alt_text,
          event_id,
          place_id,
          review_id,
          user_id,
          // ...createMediaInput,
          isCover: String(createMediaInput.isCover) === 'true',
          url: fileUrl,              
          mime_type: fileType,
          status: 'PENDING',
          metadata: createMediaInput.metadata ? JSON.stringify(createMediaInput.metadata) : undefined,
          size: createMediaInput.size ?? 0,
        },
      });
      return {
        ...createdMedia,
        metadata: createdMedia.metadata ? JSON.parse(createdMedia.metadata as string) : null,
      };
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear media');
    }
  }

  async confirmUpload(id: string): Promise<Media> {


    console.log(id);
    
    try {

      const updatedMedia = await this.prisma.media.update({
        where: { id },
        data: { status: 'READY' },
      });

      try {
        await this.uploadToStream(updatedMedia.url);
      }catch (error){
        console.log(error);
      }

      return {
        ...updatedMedia,
        metadata: (typeof updatedMedia.metadata === 'string') 
        ? JSON.parse(updatedMedia.metadata)
        : updatedMedia.metadata,
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('No se pudo confirmar la carga, el registro no existe');
    }
  }

  async remove(id: string ) {
    
    const media = await this.prisma.media.findUnique({ where: { id } });


    if (!media) throw new NotFoundException('La imagen no existe');
  
    
    const fileKey = media.url.split('/').pop()!;
  
    
    await this.storageService.deleteFile(fileKey);
  
    
    return await this.prisma.media.delete({ where: { id } });
  }

  async findAll(
    filters: MediaFilters,
    paginationArgs: PaginationArgs,
    isRandom: boolean = false,
    seed?: number
  ): Promise<MediaResponse> {
    const { current = 1 } = paginationArgs;
    const limit = 20;
    const skip = (current - 1) * limit;

    const where: Prisma.mediaWhereInput = {
      status: 'READY',
    };
    if(filters.event_id && filters.event_id.length > 0) where.event_id = {in: filters.event_id};
    if(filters.place_id && filters.place_id.length > 0) where.place_id = {in: filters.place_id};
    if(filters.user_id && filters.user_id.length > 0) where.user_id = {in: filters.user_id};
    if(filters.mime_type && filters.mime_type.length > 0) where.mime_type = {in: filters.mime_type};
    if (filters.isCover && filters.isCover.length === 1) {
      where.isCover = filters.isCover[0];
    }

    try {
      let media;
      let totalCount;

      if (isRandom) {
        totalCount = await this.prisma.media.count({ where });

        const allIds = await this.prisma.media.findMany({
          where,
          select: { id: true }
        });

        const seedValue = seed ?? Math.floor(Math.random() * 1000000);
        const shuffledIds = shuffleArray(allIds.map((m) => m.id), seedValue);
        const pagedIds = shuffledIds.slice(skip, skip + limit);

        media = await this.prisma.media.findMany({
          where: { id: { in: pagedIds } },
          include: {
            event: {
              include:{
                category:true,
                state:true
              }
            },
            place: {
              include:{
                state:true,
                category:true,
                city:true
              }
            },
            user: true,
          }
        });

        // Maintain random order
        media.sort((a, b) => pagedIds.indexOf(a.id) - pagedIds.indexOf(b.id));
      } else {
        [media, totalCount] = await Promise.all([
          this.prisma.media.findMany({
            where,
            skip,
            take: limit,
            include: {
              event: true,
              place: true,
              user: true,
            }
          }),
          this.prisma.media.count({ where }),
        ]);
      }

      const totalPages = Math.ceil(totalCount / limit);

      return {
        info: {
          count: totalCount,
          pages: totalPages,
          next: current < totalPages ? current + 1 : undefined,
          prev: current > 1 ? current - 1 : undefined,
        },
        media,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error al obtener media');
    }
  }

  async findOne(id: string): Promise<Media> {
    try {
      const media = await this.prisma.media.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return {
        ...media,
        metadata: media.metadata ? JSON.parse(media.metadata as string) : null,
      };
    } catch (error) {
      throw new Error('Error al obtener media');
    }
  }

  async update(id: string, updateMediaInput: UpdateMediaInput): Promise<Media> {
    try {
      const updateData = Object.fromEntries(
        Object.entries(updateMediaInput).filter(([, value]) => value !== undefined)
      );
      const updatedMedia = await this.prisma.media.update({
        where: {
          id,
        },
        data: updateData as Prisma.mediaUpdateInput,
      });
      return {
        ...updatedMedia,
        metadata: updatedMedia.metadata ? JSON.parse(updatedMedia.metadata as string) : null,
      };
    } catch (error) {
      throw new Error('Error al actualizar media');
    }
  }
}
