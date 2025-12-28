import { type SchemaTypeDefinition } from 'sanity'
import dailyFire from './dailyFire'
import readingPlan from './readingPlan'
import dailyReading from './dailyReading'
import scriptureReference from './scriptureReference'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [dailyFire, readingPlan, dailyReading, scriptureReference],
}