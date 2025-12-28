import { defineField, defineType } from 'sanity'
import scriptureReference from './scriptureReference'

export default defineType({
  name: 'dailyReading',
  title: 'Daily Reading',
  type: 'document',
  fields: [
    defineField({
      name: 'day',
      title: 'Day Number',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'dayTitle',
      title: 'Day Title',
      type: 'string',
      description: 'Optional title for the day (e.g., "Day 1: Finding Hope")',
    }),
    defineField({
      name: 'devotional',
      title: 'Devotional Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Main devotional content - can include multiple paragraphs',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture References',
      type: 'array',
      of: [{ type: 'scriptureReference' }],
      description: 'All scripture references for this day',
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      day: 'day',
      dayTitle: 'dayTitle',
    },
    prepare({ day, dayTitle }) {
      return {
        title: dayTitle || `Day ${day}`,
        subtitle: `Day ${day}`,
      }
    },
  },
  orderings: [
    {
      title: 'Day Number',
      name: 'dayAsc',
      by: [{ field: 'day', direction: 'asc' }],
    },
  ],
})
