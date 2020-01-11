import { serialize, deserialize, serializeAs, deserializeAs, deserializeIndexable } from 'cerialize';

export class WallpointData {
  @deserialize position_x: number;
  @deserialize position_y: number;
}

export class TimeRange {
  @deserializeAs(Date) timestampStart: Date;
  @deserializeAs(Date) timestampEnd: Date;
}

export class CowshedData {
  @deserializeAs('idCowShed') cowshedId: number;
  @deserialize width: number;
  @deserialize height: number;

  @deserializeAs('idFarm') farmId: number;

  @deserializeAs(WallpointData, 'wallpointDtos') wallpoints: Array<WallpointData>;

  @deserializeAs(TimeRange, 'cowShedTimestampsDto') dataTimeRange: TimeRange;
}
