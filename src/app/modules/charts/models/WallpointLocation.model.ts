import { deserialize } from 'cerialize';


export class WallpointLocation {
  @deserialize
  posX: number;

  @deserialize
  posY: number;

  @deserialize
  wallpointWidth: number;

  @deserialize
  wallpointHeight: number;

  @deserialize
  cowsCount: number;

  @deserialize
  cowsId: number[];
}
