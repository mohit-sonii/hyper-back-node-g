import { Counter } from "../model/Counter.model"

export const generatePropertyId = async():Promise<string>=>{
    const newCounter = await Counter.findOneAndUpdate(
        {id:'property'},
        {$inc:{seq:1}},
        {new:true,upsert:true}
    )
    return `PROP${newCounter.seq}`;
}