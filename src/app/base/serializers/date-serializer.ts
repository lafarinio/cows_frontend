

export class DateSerializer {
  Serialize(date: Date) {
    return date.toString();
  }

  Deserialize(json: any) {
    return new Date(Date.parse(json));
  }
}

export const dateSerializer = new DateSerializer();
