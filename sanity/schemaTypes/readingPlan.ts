import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'readingPlan',
  title: 'Reading Plan',
  type: 'document',
  fields: [
    defineField({
      name: 'planId',
      title: 'Plan ID',
      type: 'string',
      description: 'Unique identifier (e.g., healing-from-shame-30)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (Days)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Healing', value: 'healing' },
          { title: 'Prophecy', value: 'prophecy' },
          { title: 'Sabbath', value: 'sabbath' },
          { title: 'Health', value: 'health' },
          { title: 'New Believer', value: 'new-believer' },
          { title: 'Advent', value: 'advent' },
          { title: 'Character', value: 'character' },
          { title: 'Topical', value: 'topical' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sdaAligned',
      title: 'SDA Aligned',
      type: 'boolean',
      description: 'Is this plan aligned with biblical principles of wholeness and restoration?',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this plan in the featured section?',
      initialValue: false,
    }),
    defineField({
      name: 'readings',
      title: 'Daily Readings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'dailyReading' }] }],
      description: 'Link to daily reading documents',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      duration: 'duration',
      category: 'category',
    },
    prepare({ title, duration, category }) {
      return {
        title,
        subtitle: `${duration} days • ${category}`,
      }
    },
  },
})
