import {ObjectSchema} from "@hapi/joi";

export function validate(data: object, schema: ObjectSchema): Promise<object> {
  return new Promise(async (resolve, reject) => {
    const options = {abortEarly: false};
    const {error, value} = schema.validate(data, options);
    if (error) {
      console.error("Validation error: ", error.details);
      reject(error);
    }
    resolve(value);
  });
}
