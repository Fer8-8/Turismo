import { registerEnumType } from '@nestjs/graphql';

export enum AssetKind {
  IMAGE = 'image',
  ATTACHMENT = 'attachment',
}

registerEnumType(AssetKind, {
  name: 'AssetKind',
  description: 'Tipo funcional del asset (imagen o adjunto)',
});
