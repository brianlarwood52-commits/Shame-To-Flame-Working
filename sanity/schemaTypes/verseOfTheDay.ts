import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'verseOfTheDay',
  title: 'Verse of the Day',
  type: 'document',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'The date this verse should be displayed',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'scripture',
      title: 'Scripture Reference',
      type: 'object',
      fields: [
        { 
          name: 'reference', 
          title: 'Reference', 
          type: 'string',
          description: 'e.g., "John 3:16"',
          validation: (Rule) => Rule.required()
        },
        { 
          name: 'text', 
          title: 'Verse Text', 
          type: 'text',
          description: 'The full text of the verse',
          validation: (Rule) => Rule.required()
        },
        {
          name: 'translation',
          title: 'Translation',
          type: 'string',
          description: 'e.g., "KJV", "ESV", "NIV"',
          initialValue: 'KJV'
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'encouragingThought',
      title: 'Encouraging Thought',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'A brief, encouraging reflection on the verse',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for categorizing (e.g., hope, healing, faith, love)',
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Mark as featured to highlight on homepage',
      initialValue: false
    })
  ],
  preview: {
    select: {
      date: 'date',
      reference: 'scripture.reference',
      thought: 'encouragingThought'
    },
    prepare({ date, reference, thought }) {
      const dateStr = date ? new Date(date).toLocaleDateString() : 'No date'
      const thoughtPreview = thought 
        ? (Array.isArray(thought) ? thought[0]?.children?.[0]?.text : thought).substring(0, 50) + '...'
        : 'No thought'
      return {
        title: reference || 'No reference',
        subtitle: `${dateStr} - ${thoughtPreview}`
      }
    }
  },
  orderings: [
    {
      title: 'Date, Newest',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }]
    },
    {
      title: 'Date, Oldest',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }]
    }
  ]
})
