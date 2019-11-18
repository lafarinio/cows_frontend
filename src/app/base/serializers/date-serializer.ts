

export class DateSerializer {
  Serialize(date: Date) {
    return date.toString();
  }

  Deserialize(json: any) {
    return Date.parse(json);
  }
}

export const dateSerializer = new DateSerializer();
