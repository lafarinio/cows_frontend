import { serialize, deserialize, serializeAs, deserializeAs, inheritSerialization } from 'cerialize';

export class CowshedSection {
  @deserializeAs('cowsCount') numOfCows: number;
  @deserializeAs('cowsId') cows: string;

  @deserialize posX: number;
  @deserialize posY: number;
}

export class CowshedContent {
  @deserializeAs('cowShedId') cowshedId: number;

  @deserializeAs(CowshedSection, 'sectionDtos') cowshedSections: Array<CowshedSection>

  @deserializeAs(Date, 'timeStamp') timestamp: Date;
}
