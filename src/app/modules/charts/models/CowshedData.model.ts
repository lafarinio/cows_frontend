import { serialize, deserialize, serializeAs, deserializeAs, deserializeIndexable } from 'cerialize';

export class WallpointData {
  @deserialize position_x: number;
  @deserialize position_y: number;
}

export class CowshedTimeRange {
  @deserialize timestampStart: string;
  @deserialize timestampEnd: string;
}

export class CowshedData {
  @deserializeAs('idCowShed') cowshedId: number;
  @deserialize width: number;
  @deserialize height: number;

  @deserializeAs('idFarm') farmId: number;

  @deserializeAs(WallpointData, 'wallpointDtos') wallpoints: Array<WallpointData>;

  @deserializeAs(CowshedTimeRange, 'cowShedTimestampsDto') dataTimeRange: CowshedTimeRange;
}

export class CowshedDataAtTime {
  cowshed: CowshedData;

  timestamp: Date;

  constructor(c: CowshedData, t: Date)
  {
    this.cowshed = c;
    this.timestamp = t;
  }
}
