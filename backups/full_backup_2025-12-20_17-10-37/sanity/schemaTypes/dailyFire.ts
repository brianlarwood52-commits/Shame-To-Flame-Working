import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'dailyFire',
  title: 'Daily Fire Devotional',
  type: 'document',
  fields: [
    defineField({ name: 'day_number', title: 'Day Number', type: 'number' }),
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture',
      type: 'object',
      fields: [
        { name: 'reference', title: 'Reference', type: 'string' },
        { name: 'text', title: 'Verse Text', type: 'text' }
      ]
    }),
    defineField({ name: 'message', title: 'Message', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'reflection', title: 'Reflection', type: 'text' }),
    defineField({ name: 'prayer', title: 'Prayer', type: 'text' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'day_number' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `Day ${subtitle}` }
    }
  }
})