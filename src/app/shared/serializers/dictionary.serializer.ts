import { Dictionary } from '../models/dictionary.model';


export class DictionarySerializer {
  // Serialize(date: Date) {
  //   return date.toString();
  // }

  Deserialize(json: any): Dictionary<any> {
    return Object.keys(json).reduce((result, key) => {
      result[key] = json[key];
      return result;
    }, []);
  }
}

export const dictionarySerializer = new DictionarySerializer();
